<template>
    <Page class="page">
        <ActionBar class="action-bar">
            <Label class="action-bar-title" :text="this.Title" horizontalAlignment="center" />
        </ActionBar>
        <ScrollView>
            <WebView :src="this.Url" />
        </ScrollView>
    </Page>
</template>


<script>

import Tracer from '../common/Tracer';

export default {
    props : { // https://vuejs.org/v2/guide/components-props.html
        Url: {
            type:String,
            required: true
        },
        Title: {
            type:String,
            required: true
        }   
    },
    data() {
        return {
            name:'WebViewer.vue'
        };
    },
    mounted() {
    },
    created() {
        Tracer.log(`loading ${this.Url}`, this);
    },
    methods:{
    },
    computed: {
    }
};
</script>

<style scoped lang="scss">
    @import '../app-variables';
    @import '../app-common';
    @import './app-component';
</style>
