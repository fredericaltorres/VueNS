import Vue from "nativescript-vue";
import firebase from "nativescript-plugin-firebase";
import Tracer from './Tracer';

const DEFAULT_MAX_RECORD = 400;
const DEFAULT_ID_FIELD_NAME = "id";
const UPDATE_AT_PROPERTY_NAME = "updatedAt";

const getSettings = () => {

	return { timestampsInSnapshots: true };
}

class FirebaseManagerNS {

    // static _initialized = false;
	
    constructor() {

        Tracer.coloredConsole = false;
        this.name = "FirestoreManager";
        Tracer.log(`FirebaseManagerNS constructor`, this);
        this._monitoredSnapshot = {};
        this._settings = getSettings();
        firebase.init({ persist: false }).then(
            instance => {
                Tracer.log("firebase.init done ", this);
            },
            error => {
                Tracer.log(`firebase.init -> error: ${error}`, this);
            }
        );
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
}

export default new FirebaseManagerNS()