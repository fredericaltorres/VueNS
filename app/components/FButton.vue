<template>
      <Button class="btn btn-primary FButtonStyle" 
      :text="this.Text" @tap="this._onClick" />
</template>

<script>

import Tracer from '../common/Tracer';

export default {
    props : { // https://vuejs.org/v2/guide/components-props.html
        Text: {
            type:String
        },
        OnClick: {
            type: Function
        }
    },
    data() {
        return {
            name:'FButton.vue'
        };
    },
    mounted() {
    },
    created() {
    },
    methods:{
        _onClick() {
            Tracer.log(`_onClick ${this.Text}`, this);
            return this.OnClick();
        }
    },
    computed: {
    }
};
</script>

<style scoped lang="scss">
    @import '../app-variables';
    @import '../app-common';
    @import './app-component';

    // /Users/fredericaltorres/DVT/VueNS/node_modules/nativescript-theme-core/scss/_variables.scss

    .FButtonStyle {
        font-weight: bold; 
        font-size:20;
        border-radius: 5;
        border-color: black;
        border-width: 2;
    }
</style>
