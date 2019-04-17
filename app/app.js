import Vue from "nativescript-vue";
import firebase from "nativescript-plugin-firebase";
import config from "./shared/firebase-config";

import Home from "./components/Home";
import Tracer from './common/Tracer';
import firebaseManagerNS from './common/FirebaseManagerNS';

Vue.config.silent = true;

new Vue({

    template: `
        <Frame>
            <Home />
        </Frame>`,

    components: {
        Home,
    },

    created() {
        console.log(`[APP]Starting, init firebase config:${JSON.stringify(config)}`);
        const DBLinksCollectionName = 'DBLinks';
        firebaseManagerNS.monitorQuery(DBLinksCollectionName,
        (records) => { 
            Tracer.log(`Collection ${DBLinksCollectionName} change detected, ${records.length} record(s)`, this);
        },
        'createdAt', undefined, undefined, firebaseManagerNS.whereClause('category', 'Software', 'All')
        );
        // firebase.init({ persist: false }).then(
        //     instance => {
        //         try {
        //             console.log("firebase.init done");
        //             const firestoreDB = firebase.firestore;
        //             console.log(`firestoreDB:${typeof(firestoreDB)}`);
        //             console.log(`collection::${typeof(firestoreDB.collection)}`);
        //             const docRef = firestoreDB.collection('DBLinks').doc('eca283b28904');
        //             console.log(`docRef:${typeof(docRef)}`);
        //             docRef.get().then((doc) => {
        //                 const data = doc.data();
        //                 console.log(`Firestore DBLink ${JSON.stringify(data)}`);
        //             }).catch((err) => {
        //                 console.error(`error catch reading firestore db err:${err}`);
        //             });
        //         }
        //         catch(ex){
        //             console.error(`error reading firestore data ex:${ex}`);
        //         }
        //     },
        //     error => {
        //         console.log(`firebase.init -> error: ${error}`);
        //     }
        // );
    }

}).$start();
