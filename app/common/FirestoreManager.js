/*
	Firebase / Cloud Firestore helper class

	Auth: https://firebase.google.com/docs/auth/web/manage-users?authuser=0
	Pricing: https://firebase.google.com/pricing/?authuser=0
	Database operation
		Query			
			https://firebase.google.com/docs/firestore/query-data/get-data
			https://firebase.google.com/docs/database/web/lists-of-data
			https://firebase.google.com/docs/firestore/query-data/listen
			https://firebase.google.com/docs/database/web/read-and-write
		Delete
			https://firebase.google.com/docs/firestore/manage-data/delete-data
		Add			
			https://firebase.google.com/docs/firestore/manage-data/add-data
			https://firebase.google.com/docs/firestore/manage-data/transactions#batched-writes

	Torres Frederic 2018			
*/
import Tracer from './Tracer';
import moment from "moment"; // http://momentjs.com/
import FirestoreManagerConfig from './FirestoreManagerConfig';
import ComponentUtil from './ComponentUtil';
import TypeUtil from './TypeUtil';
import TypeDefUtil from './TypeDefUtil';


const DEFAULT_MAX_RECORD = 400;
const DEFAULT_ID_FIELD_NAME = "id";
const UPDATE_AT_PROPERTY_NAME = "updatedAt";

const getSettings = () => {

	return { timestampsInSnapshots: true };
}

// This class is exported as a singleton.
// Therefore static members could be just members
class FirestoreManager {

	static _initialized = false;
	
	// Static object to store snapshot unsusbcribe method, to be able to 
	// unsubscribe and stop monitoring data
	static _monitoredSnapshot = { };
	
	constructor() {

		this.ADMIN_ROLE = "administrator";

		this._settings = getSettings();
		this.batchModeOn = false;
		this._currentUserAuthAuth = null;
		this.onCurrentUserLoadedCallBack = null;
		this.name = "FirestoreManager";

		if(!FirestoreManager._initialized) {
			
			this.name = 'FirestoreManager';
			Tracer.log(`FirestoreManager init`, this);
			firebase.initializeApp(FirestoreManagerConfig);
			FirestoreManager._initialized = true;
			this.__setUpOnAuthStateChanged();
		}
	}

	__setUpOnAuthStateChanged () {

		firebase.auth().onAuthStateChanged((user) => {

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

					Tracer.log(`FirestoreManager currentUser:${this.getCurrentUser().displayName}, udi:${this.getCurrentUserUID()}`, this);

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
		});
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

	__currentUserHasRole(role) {

		if(!this._currentUserAuthAuth)
			return false;

		return this._currentUserAuthAuth.roles.indexOf(role) !== -1;
	}

	// return true if the current user already loaded is an admin.
	// if the user is not loaded, there is no call to load the user auth auth data
	getCurrentUserLoadedIsAdmin() {

		return this.__currentUserHasRole(this.ADMIN_ROLE);		
	}

	// https://grokonez.com/android/firebase-authentication-sign-up-sign-in-sign-out-verify-email-android
	getCurrentUser() {

		return firebase.auth().currentUser;
	}

	isCurrentUserLoaded() {

		return this.getCurrentUser() !== null;
	}

	getCurrentUserUID() {

		return this.__getCurrentUserProperty("uid");
	}

	getCurrentUserDisplayName() {

		return this.__getCurrentUserProperty("displayName");
	}

	getCurrentUserEmail() {

		return this.__getCurrentUserProperty("email");
	}

	__getCurrentUserProperty(prop) {

		const currentUser = this.getCurrentUser();
		if(currentUser)
			return currentUser.providerData[0][prop];
		return null;			
	}

	// Return a promise
	__loadUserAuthAuth(uid) {

		return this.loadDocument('_users', uid, null, false);
	}

	// Return a promise
	logOut() {
		this._currentUserAuthAuth = null;
		return firebase.auth().signOut();
	}

	// https://firebase.google.com/docs/auth/web/manage-users?authuser=0
	googleLogin() {

		return new Promise((resolve, reject) => {

			const provider = new firebase.auth.GoogleAuthProvider();

			firebase.auth().signInWithPopup(provider)
				.then((result) => {

					const user = result.user;
					alert(`Hello ${user.displayName}`);
					resolve();
				})
				.catch((error) => {

					Tracer.error(error, this);
					reject();
				});
		});
	}

	getFirestoreDB() {

		if(this._firestoreDb) 
			return this._firestoreDb;

		const firestore = firebase.firestore();
		firestore.settings(this._settings);
		this._firestoreDb = firestore;
		return this._firestoreDb;
	}
	
	getStorage() {

		return firebase.storage();
	}

	getStorageRef() {

		return this.getStorage().ref();
	}

	uploadTextAsFileToStorage(fileName, text) {

		Tracer.log(`upload text file:${fileName}`, this);

		return new Promise((resolve, reject) => {

			const storageRef = this.getStorageRef();
			var mountainsRef = storageRef.child(fileName);
			mountainsRef.putString(text)
				.then((snapshot) => {

					Tracer.log(`text file ${fileName} created`, this);
					resolve(fileName);
				}).catch((err) => {

					Tracer.error(`text file ${fileName} creation failed`);
					reject(fileName);
				});
		});
	}

	// https://firebase.google.com/docs/storage/web/file-metadata
	GetFileMetaDataFromStorage(fileNameOnly, parentFolder = null) {

		const fileName = this.getStorageFullPath(parentFolder, fileNameOnly);
		Tracer.log(`GetFileMetaDataFromStorage file:${fileName}`, this);

		return new Promise((resolve, reject) => {

			var fileRef = this.getStorageRef().child(fileName);
			fileRef.getMetadata()
				.then((metadata) => {

					// Tracer.log(`GetFileMetaDataFromStorage file:${fileName} ok`, this);
					fileRef.getDownloadURL().then((downloadURL) => {
						metadata.downloadURL = downloadURL;
						resolve(metadata);
					});
				}).catch((err) => {

					Tracer.log(`GetFileMetaDataFromStorage file:${fileName} failed ${err}`, this);
					reject(err);
				});
		});
	}

	deleteFileFromStorage(fileNameOnly, parentFolder = null) {

		const fileName = this.getStorageFullPath(parentFolder, fileNameOnly);
		Tracer.log(`deleteFileFromStorage file:${fileName}`, this);

		return new Promise((resolve, reject) => {

			var fileRef = this.getStorageRef().child(fileName);
			fileRef.delete()
				.then(() => {

					Tracer.log(`deleteFileFromStorage file:${fileName} deleted`, this);
					resolve(true);
				}).catch((err) => {

					Tracer.log(`deleteFileFromStorage file:${fileName} failed ${err}`, this);
					reject(err);
				});
		});
	}

	// https://developer.mozilla.org/en-US/docs/Web/API/FileList
	uploadFileToStorage(fileObject, parentFolder = null) {

		const fileName = this.getStorageFullPath(parentFolder, fileObject.name);
		Tracer.log(`uploadFileToStorage file:${fileName}`, this);

		return new Promise((resolve, reject) => {

			const storageRef = this.getStorageRef();
			var mountainsRef = storageRef.child(fileName);
			mountainsRef.put(fileObject)
				.then((snapshot) => {

					Tracer.log(`File ${fileName} uploaded`, this);
					resolve(fileName);
				}).catch((err) => {
					
					Tracer.error(`File ${fileName} uploaded failed`);
					reject(fileName);
				});
		});
	}

	getStorageFullPath(parentFolder, fileName) {
		return (parentFolder == null) ? "" : parentFolder.toString() + "/" + fileName;
	}

	getCollection(name) {

		return this.getFirestoreDB().collection(name);
	}

	startBatch() {
		
		Tracer.log(`startBatch`, this);
		this.batchModeOn = true;
		return this.getFirestoreDB().batch();
	}

	commitBatch(batch) {

		Tracer.log(`commitBatch`, this);
		console.log('batch', batch);
		this.batchModeOn = false;
		return batch.commit();
	}

	showErrorToUser(msg) {

		Tracer.error(msg, this);
		alert(`ERROR: ${msg}`);
	}

	__rebuildDocument(doc,  idFieldName = DEFAULT_ID_FIELD_NAME) {

		const data = doc.data();
		if(!data)
			return null; // The document does not exist
		data[idFieldName] = doc._key.toString();
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
		
		if(FirestoreManager._monitoredSnapshot[collection]) {

			Tracer.log(`Unsubscribe monitored snapshot:${collection}`, this);
			this.__unsubscribeMonitoredSnapshot(FirestoreManager._monitoredSnapshot[collection]);
			delete FirestoreManager._monitoredSnapshot[collection];
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
		FirestoreManager._monitoredSnapshot[collection] = query.onSnapshot((querySnapshot) => {

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

	loadDocuments(collection, orderByColumn = null, orderDirection = 'desc', maxRecord = DEFAULT_MAX_RECORD, nameResult = null) {

		Tracer.log(`loadDocuments(${collection}, ${orderByColumn}, ${orderDirection}, ${maxRecord})`, this);

		return new Promise((resolve, reject) => {

			const dbToDoItems = this.getCollection(collection);
			let query = null;
			if(orderByColumn)
				query = dbToDoItems.orderBy(orderByColumn, orderDirection).limit(maxRecord);
			else				
				query = dbToDoItems.limit(maxRecord);

			query.get().then(todoItems => {

				const items = this.__rebuildDocuments(todoItems)
				Tracer.log(`loadDocuments(${items.length} records loaded)`, this);
				if(nameResult) {
					resolve( { [nameResult]:items } );
				}
				else {
					resolve(items);
				}	
			});
		});
	}

	// https://firebase.google.com/docs/database/web/read-and-write
	updateRecord(collection, oData, idFieldName = DEFAULT_ID_FIELD_NAME, overWriteDoc = true) {
		
		// Update property updateAt if exist
		if(oData[UPDATE_AT_PROPERTY_NAME])
			oData[UPDATE_AT_PROPERTY_NAME] = this.now();

		// Duplicate the object for now, trying to removed and add the
		// id property created some problems
		const data = Object.assign({}, oData);
		const longId = data[idFieldName];
		const idStringForTracing = `${idFieldName}:${longId}`;
		const id = this.extractId(longId);

		Tracer.log(`updateRecord ${idStringForTracing}`, this);				

		data[DEFAULT_ID_FIELD_NAME] = id; // Remove the collection name from the id
		// The id property is stored twice as the document key and as the property id
		const docRef = this.getCollection(collection).doc(id); // Load the record

		let p = null;
		if(overWriteDoc)
			p = docRef.set(data); // overwrite mode
		else				
			p = docRef.update(data); // Merge mode

		if(this.batchModeOn) {

		}
		else {
			return new Promise((resolve, reject) => {

				p.then(() => {

					Tracer.log(`updateRecord ${idStringForTracing} succeeded`, this);
					resolve(longId);

				}).catch((error) => {

					this.showErrorToUser(`updateRecord ${idStringForTracing} failed ${error}`);
					reject(error);
				});
			});
		}
	}

	// https://firebase.google.com/docs/firestore/manage-data/delete-data
	deleteRecord(collection, id) {

		if(this.batchModeOn) {
			Tracer.log(`deleteRecord batch id:${id}`, this);
			id = this.extractId(id);
			const docRef = this.getCollection(collection).doc(id);
			docRef.delete();
		}
		else {

			return new Promise((resolve, reject) => {

				Tracer.log(`deleteRecord id:${id}`, this);
				id = this.extractId(id);
				const docRef = this.getCollection(collection).doc(id);
				docRef.delete()
					.then(() => {
	
						Tracer.log(`deleteRecord  id:${id} succeeded`, this);
						resolve(id);
					})
					.catch((error) => {
	
						this.showErrorToUser(`deleteRecord  id:${id} failed ${error}`);
						reject(error);
					});
			});			
		}
	}

	// https://firebase.google.com/docs/firestore/manage-data/add-data
	// https://firebase.google.com/docs/firestore/manage-data/transactions#batched-writes
	addRecord(collection, data, idFieldName = DEFAULT_ID_FIELD_NAME) {

		// The id property is stored twice as the document key and as the property id
		let id = data[idFieldName];
		if(!id) {
			id = ComponentUtil.getNewUniqueId();
		}
			
		if(this.batchModeOn) {

			this.getCollection(collection).doc(id).set(data);			
		}
		else { 

			return new Promise((resolve, reject) => {
				
				const idStringForTracing = `${idFieldName}:${id}`;
				Tracer.log(`addRecord ${idStringForTracing}`, this);

				this.getCollection(collection).doc(id).set(data)
					.then(() => {

						Tracer.log(`addRecord ${idStringForTracing} succeeded`, this);
						resolve({ ...data, [idFieldName]:`${collection}/${id}` });
					})
					.catch((error) => {

						this.showErrorToUser(`addRecord ${idStringForTracing} failed ${error}`);
						reject(error);
					});
			});
		}
	};

	// https://firebase.google.com/docs/reference/js/firebase.firestore.Timestamp
	formatTimestamp(timestamp, format = 'YYYY/MM/DD h:mm:ss a') {

		return TypeDefUtil.formatFirebaseTimestamp(timestamp, format);
	}

	extractId(refId) {

		const parts = refId.split('/');
		if(parts.length > 0) {
			return parts[parts.length-1];
		}
		return refId;
	}

	now() {

		return firebase.firestore.Timestamp.now();
	}

	invertOrderDirection(d) {

		return d === 'desc' ? 'asc' : 'desc';
	}

	orderDirectionIcon(d) {
		return d === 'desc' ? "[D]" : "[A]";
	}
}  

export default new FirestoreManager();
