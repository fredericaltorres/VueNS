import Vue from "nativescript-vue";
import firebase from "nativescript-plugin-firebase";
import Tracer from './Tracer';
import TypeUtil from './TypeUtil';

const DEFAULT_MAX_RECORD = 400;
const DEFAULT_ID_FIELD_NAME = "id";
const UPDATE_AT_PROPERTY_NAME = "updatedAt";

const getSettings = () => {

	return { timestampsInSnapshots: true };
}

class FirebaseManagerNS {

    // static _initialized = false; // TODO: UPDATE remove the static field
	
    constructor(nativeScriptRunTime = false) {

        Tracer.coloredConsole = false;
        this.ADMIN_ROLE = "administrator";
        this.name = "FirestoreManager";
        Tracer.log(`FirebaseManagerNS constructor`, this);
        this._nativeScriptRunTime = nativeScriptRunTime;
        this._monitoredSnapshot = {};
        this._settings = getSettings();
        this.batchModeOn = false;
		this._currentUserAuthAuth = null;
        this.onCurrentUserLoadedCallBack = null;
        this._nativeScriptUser = null; // TODO: UPDATE
        
        // https://github.com/eddyverbruggen/nativescript-plugin-firebase/blob/master/docs/AUTHENTICATION.md#email-password-login
        firebase.init({ 
            persist: false,
            // onAuthStateChanged: function(data) { // optional but useful to immediately re-logon the user when he re-visits your app
            //     console.log(data.loggedIn ? "Logged in to firebase" : "Logged out from firebase");
            //     if (data.loggedIn) {
            //       console.log("user's email address: " + (data.user.email ? data.user.email : "N/A"));
            //     }
            //   } 
        }).then(
            instance => {
                Tracer.log("firebase.init done ", this);
                this.__setUpOnAuthStateChanged();
            },
            error => {
                Tracer.log(`firebase.init -> error: ${error}`, this);
            }
        );
    }

    __setUpOnAuthStateChanged () {

        // TODO: UPDATE
		firebase.auth().onAuthStateChanged(this.__onNewUserAuthenticated);
    }    
    
    // TODO: UPDATE
    __onNewUserAuthenticated (user) {

        if (user) {
            if (user == null) {
                this._currentUserAuthAuth = null;
                if(this.onCurrentUserLoadedCallBack)
                    this.onCurrentUserLoadedCallBack(null);					
            }
            else {
                // let name = user.displayName;
                // let email = user.email;
                // let photoUrl = user.photoURL;
                // let emailVerified = user.emailVerified;
                // let uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                // 				 // this value to authenticate with your backend server, if
                // 				 // you have one. Use User.getToken() instead.

                // TODO: UPDATE
                Tracer.log(`FirestoreManager currentUser:${this.getCurrentUserEmail()}, udi:${this.getCurrentUserUID()}`, this);

                // https://firebase.google.com/docs/reference/js/firebase.User#getIdToken
                // this.getCurrentUser().getIdToken().then(data => alert(data));

                if(this.onCurrentUserLoadedCallBack)
                    this.onCurrentUserLoadedCallBack(this.getCurrentUser());
            }
        } else {
            console.log('No user change or log out');
            this._currentUserAuthAuth = null;
            if(this.onCurrentUserLoadedCallBack)
                this.onCurrentUserLoadedCallBack(null);
        }
    }  

	// https://grokonez.com/android/firebase-authentication-sign-up-sign-in-sign-out-verify-email-android
    // TODO: UPDATE
    getCurrentUser() {
        if(this._nativeScriptRunTime)
            return this._nativeScriptUser;
            // The NativeScript getCurrentUser return a promise
            // return firebase.getCurrentUser() => Promise
        else 
            return firebase.auth().currentUser;
    }
    
    isCurrentUserLoaded() {

		return this.getCurrentUser() !== null;
	}

	getCurrentUserUID() {

		return this.__getCurrentUserProperty("uid");
	}

	getCurrentUserDisplayName() {

        var r = this.__getCurrentUserProperty("displayName");
        if(!r) {
            return this.getCurrentUserEmail();
        }
	}

	getCurrentUserEmail() {

		return this.__getCurrentUserProperty("email");
	}

	__getCurrentUserProperty(prop) {

        // TODO: UPDATE
        const currentUser = this.getCurrentUser();
        if(currentUser) {
            if(this._nativeScriptRunTime) {
                return currentUser[prop];
            }
            else {
                return currentUser.providerData[0][prop];
            }
        }
        Tracer.warn(`currentUser not defined yet, cannot get ${prop}`, this);		
        return null;	
	}

    getFirestoreDB() {

		if(this._firestoreDb) 
			return this._firestoreDb;

		const firestore = firebase.firestore; // With NativeScript firebase.firestore is an object
		firestore.settings(this._settings);
		this._firestoreDb = firestore;
		return this._firestoreDb;
    }

    getCollection(name) {

		return this.getFirestoreDB().collection(name);
    }    

    __rebuildDocument(doc,  idFieldName = DEFAULT_ID_FIELD_NAME) {

        const data = doc.data();
		if(!data)
			return null; // The document does not exist
		// data[idFieldName] = doc._key.toString(); // This is not needed with Firestore Native Script
		return data;
	}

    __rebuildDocuments(documents) {

		const records = [];
		documents.forEach((doc) => { 
			records.push(this.__rebuildDocument(doc)); 
		});
		return records;
	}

    __unsubscribeMonitoredSnapshot(unsubscribe) {

		unsubscribe();
    }    

    stopMonitorQuery(collection) {
		
		if(this._monitoredSnapshot[collection]) {

			Tracer.log(`Unsubscribe monitored snapshot:${collection}`, this);
			this.__unsubscribeMonitoredSnapshot(this._monitoredSnapshot[collection]);
			delete this._monitoredSnapshot[collection];
		}
	} 

    whereClause(property, value, ignoreValue, operator = '==') {

		if(value === ignoreValue)
			return null;
		return { property, operator, value };
    }

    // https://firebase.google.com/docs/database/web/lists-of-data
    // https://firebase.google.com/docs/firestore/query-data/listen
    monitorQuery(
        collection, 
        callBack, 
        orderByColumn = null, 
        orderDirection = 'desc', 
        maxRecord = DEFAULT_MAX_RECORD,
        whereClause = null
    ) {
        Tracer.log(`monitorQuery ${collection}, orderByColumn:${orderByColumn}/${orderDirection}, maxRecord:${maxRecord}`, this);
        this.stopMonitorQuery(collection);

        let col = this.getCollection(collection);
        if(whereClause) {
            col = col.where(whereClause.property, whereClause.operator, whereClause.value)
        }
        let query = null;
        if(orderByColumn) {
            query = col
                .orderBy(orderByColumn, orderDirection)
                    .limit(maxRecord);
        }
        else {
            query = col.limit(maxRecord);
        }

        // Return a function handler that can unsubscribe the snapshot 
        this._monitoredSnapshot[collection] = query.onSnapshot((querySnapshot) => {

            let records = this.__rebuildDocuments(querySnapshot)
            try {
                // if(filterFunc) {
                // 	records = records.filter(filterFunc);
                // }
                if(callBack) callBack(records);
            }
            catch(ex) {
                Tracer.error(`monitorQuery ${collection} failed '${ex}' calling callback`);
            }
        });
        return true;
    }    
        
    // TODO: UPDATE
	logOut() {

        this._currentUserAuthAuth = null;
        
        if(this._nativeScriptRunTime) {
            firebase.logout();
            return Promise.resolve();        
        }
        else {
            return firebaseWebApi.auth().signOut()
                .then(() => console.log("Logout OK"))
                .catch(error => console.log("Logout error: " + JSON.stringify(error)));
        }
	}

    // https://firebase.google.com/docs/auth/web/manage-users?authuser=0
    // https://github.com/eddyverbruggen/nativescript-plugin-firebase/blob/master/docs/AUTHENTICATION.md#google-sign-in
	usernamePasswordLogin(email, password) {
        Tracer.log(`usernamePasswordLogin`, this);
        const $this = this;

        if(this._nativeScriptRunTime) {
        return firebase.login(
            {
              type: firebase.LoginType.PASSWORD,
              passwordOptions: {
                email: email,
                password: password,
              }
            })
            .then(user => {
                const s = JSON.stringify(user);
                Tracer.log(`usernamePasswordLogin user:${s}`, $this);
                this._nativeScriptUser = user;
                this.__onNewUserAuthenticated(user);
            })
            .catch(error => console.log(error));
        }
        else {
            throw "usernamePasswordLogin() not implemented for browser mode"
        }
        // firebase.login({
        //     type: firebase.LoginType.GOOGLE,
        //     // Optional //
        //     googleOptions: {
        //       hostedDomain: "mygsuitedomain.com"
        //     }
        //   }).then(
        //       function (result) {
        //         Tracer.log(`googleLogin B`);
        //         JSON.stringify(result);
        //       },
        //       function (errorMessage) {
        //         Tracer.log(`googleLogin C`);
        //         console.log(errorMessage);
        //       }
        //   );
    }	
    
    // Return a promise
	__loadUserAuthAuth(uid) {

		return this.loadDocument('_users', uid, null, false);
    }

    // If the current user auth auth record is not loaded then load it first, the return the
	// answer in a promise
	currentUserHasRole(role) {

		return new Promise((resolve, reject) => {

			if(this._currentUserAuthAuth === null) {

				this.__loadUserAuthAuth( this.getCurrentUserUID() ).then( (currentUserAuthAuth) => {

					if(currentUserAuthAuth === null) { // current record in _users collection was not found
						
						resolve(false);
					}
					else {

						this._currentUserAuthAuth = currentUserAuthAuth;
						resolve(this.__currentUserHasRole(role));
					}
				});
			}
			else {
				resolve(this.__currentUserHasRole(role));
			}
		});
	}

	__currentUserHasRole(role) { // TODO: UPDATE ALL FUNCTION

		if(!this._currentUserAuthAuth) { // TODO: UPDATE
            Tracer.warn(`__currentUserHasRole() was called, but the variable _currentUserAuthAuth was not loaded with roles`);
            return false;
        }
        const r = this._currentUserAuthAuth.roles.indexOf(role) !== -1;
        Tracer.log(`__currentUserHasRole(${role}) : ${r}`, this);
        return r;
	}

	// return true if the current user already loaded is an admin.
	// if the user is not loaded, there is no call to load the user auth auth data
	getCurrentUserLoadedIsAdmin() {

		return this.__currentUserHasRole(this.ADMIN_ROLE);		
	}    

    loadDocument(collection, documentId, subCollections = null, expectDocumentToExist = true) {

		Tracer.log(`loadDocument(${collection}, ${documentId})`, this);
		return new Promise((resolve, reject) => {
			
			const docRef = this.getCollection(collection).doc(documentId);
			docRef.get()
				.then(doc => {

					const item = this.__rebuildDocument(doc);

					if(item === null) { // document was not found

						if(expectDocumentToExist) 
							Tracer.throw(`loadDocument(${collection}, ${documentId}) failed`);
						else
							resolve(null); // return null to notify caller that document was not found and it was expected
					}

					if(TypeUtil.isArray(subCollections)) {  // Load sub collections

						const promises = [];

						subCollections.forEach((subCol) => {

							const subColQuery = `${item.id}/${subCol}`;
							Tracer.log(`loadDocument(${collection}, ${documentId}, SubCollection:(${subColQuery}) )`, this);
							promises.push(this.loadDocuments(subColQuery, null, null, DEFAULT_MAX_RECORD, subCol));
						});
						Promise.all(promises).then((results) => {

							results.forEach((result) => {

								const key = Object.keys(result)[0];
								const val = result[key];
								item[key] = val;
							});
							resolve(item);
						});
					}
					else {
						resolve(item);
					}
				})
				.catch((err) => { // We do not expect this catch to trigger
					Tracer.throw(`loadDocument(${collection}, ${documentId}) failed unexpected error:${err}`);
				});
		});
	}
}

export default new FirebaseManagerNS(true);
