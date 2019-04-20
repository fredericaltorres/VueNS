import Vue from "nativescript-vue";
// import firebase from "nativescript-plugin-firebase";
// import config from "./shared/firebase-config";

import Home from "./components/Home";
import Tracer from './common/Tracer';
// import firebaseManagerNS from './common/FirebaseManagerNS';

Tracer.coloredConsole = false;

Vue.config.silent = false;

Tracer.log(`Creating`, {name:'app.js'});

new Vue({
    data() {
        return {
            name:'app.js',
        }
    },
    //render: h => h('frame', [h(Home)]),
    template: `
        <Frame>
            <Home />
        </Frame>`,
    components: {
        Home,
    },
    created() {
        Tracer.log(`Created`, this);
    }
}).$start();
