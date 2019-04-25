import Vue from "nativescript-vue";
import Home from "./components/Home";
import Tracer from './common/Tracer';

Tracer.coloredConsole = false;

//Vue.config.silent = false;

function isNativeScript() {
    if(typeof(global))
        return global.toString().indexOf("NativeScriptGlobal") > 0;
    return false;
}

Tracer.log(`Creating ~~~~~~ isNativeScript:${isNativeScript()}`, {name:'app.js'});

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
