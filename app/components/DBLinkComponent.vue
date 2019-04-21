<template>
    <Page class="page">
        <ActionBar class="action-bar">
            <Label class="action-bar-title" :text="getDBLink.description" horizontalAlignment="center" />
        </ActionBar>

        <ScrollView>
            <StackLayout>
              
                <ScrollView orientation="horizontal" scrollBarIndicatorVisible="true">
                    <Label style="height:50;" class="info textData" horizontalAlignment="center" verticalAlignment="center">
                        <FormattedString>
                            <Span class="fa" text.decode=" &#xf0c1; "/> 
                            <Span class="textData" :text="getDBLink.description"/>
                        </FormattedString>
                    </Label>
                </ScrollView>   

                <LabelTextComponent :Label="`Link`" :Text="getDBLink.link" :ScrollHorizontally="true"/>
                <LabelTextComponent :Label="`Category`" :Text="getDBLink.category"/>
                <LabelTextComponent :Label="`Last Updated`" :Text="this.getDBLinkUpdateAt"/>
                <LabelTextComponent v-if="this.getDBLinkFiles.length > 0" :Label="`File` + (this.getDBLinkFiles.length > 1 ? `s`:``)" :Text="this.getDBLinkFiles.length"/>
         
                <Label text="----------------------------------------" horizontalAlignment="center" />

                <Label class="infoSmall" v-for="file in this.getDBLinkFiles" :key="file" horizontalAlignment="left" >
                   <FormattedString>
                        <Span class="faSmall" text.decode=" &#xf016; "/> <!-- https://fontawesome.com/v3.2.1/cheatsheet/ -->
                        <Span :text="file"/>
                    </FormattedString>
                </Label>

                <Button style="font-weight: bold; font-size:20;" class="btn btn-primary" text="Open Link" @tap="openLink" />
            </StackLayout>
        </ScrollView>
    </Page>
</template>

<script>

import Tracer from '../common/Tracer';
import TypeDefUtil from '../common/TypeDefUtil';
import LabelTextComponent from './LabelTextComponent';
import WebViewer from './WebViewer';

export default {
    props: ["dbLink"],
    data() {
        return {
            name:'RepositoryDetails.vue'
        };
    },
    mounted() {
    },
    created() {
    },
    components: {
        LabelTextComponent,
        WebViewer
    },
    methods:{
        openLink() {
            Tracer.log(`Open link ${this.getDBLink.link}`);
            this.$navigateTo(WebViewer, { props: { Url: this.getDBLink.link , Title: this.getDBLink.description } });  // https://docs.nativescript.org/core-concepts/navigation
        }
    },
    computed: {
        getDBLink() {
            return this.dbLink || {};
        },
        getDBLinkFiles() {
            return Object.keys(this.getDBLink.files);
        },
        getDBLinkUpdateAt() {
            return TypeDefUtil.formatFirebaseTimestamp(this.dbLink.updatedAt);
        }
    }
};
</script>

<style scoped lang="scss">
    @import '../app-variables';
    @import '../app-common';
    @import './app-component';

    .textData {
        color: $accent;
        font-weight: normal;
        padding-bottom: 10;
    }
    .textLabel {
        color: black;
        font-weight: normal;
    }    
</style>