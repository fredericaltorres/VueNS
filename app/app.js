import Vue from "nativescript-vue";
// import firebase from "nativescript-plugin-firebase";
// import config from "./shared/firebase-config";

import Home from "./components/Home";
// import CarDetails from "./components/RepositoryDetails.vue";

Vue.config.silent = true;

new Vue({

    template: `
        <Frame>
            <Home />
        </Frame>`,

    components: {
        Home,
       // CarDetails
    },

    created() {
        // console.log(`[APP]Starting, init firebase config:${JSON.stringify(config)}`);
        // firebase.init(config).then(
        //     instance => {
        //         console.log("firebase.init done");

        //         cars.load().then((data) => {
        //             this.cars = Object.values(data);
        //         })
        //     },
        //     error => {
        //         console.log(`firebase.init -> error: ${error}`);
        //     }
        // );
    }

}).$start();
