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
            
                <Label class="textLabel" text.decode="Link" horizontalAlignment="center" verticalAlignment="center"/>
                <ScrollView orientation="horizontal" scrollBarIndicatorVisible="true">
                    <Label class="textData" :text="getDBLink.link" horizontalAlignment="center" verticalAlignment="center"/>
                </ScrollView>   

                <Label class="textLabel" text.decode="Category" horizontalAlignment="center" verticalAlignment="center"/>
                <Label class="textData" :text="getDBLink.category" horizontalAlignment="center" verticalAlignment="center"/>

                <Label class="textLabel" text.decode="Last Updated" horizontalAlignment="center" verticalAlignment="center"/>
                <Label class="textData" :text="this.getDBLinkUpdateAt" horizontalAlignment="center" verticalAlignment="center"/>

                <Label class="textLabel" horizontalAlignment="center" verticalAlignment="center">
                    <FormattedString>
                        <Span text="Files: "/>
                        <Span :text="this.getDBLinkFiles.length"/>
                    </FormattedString>
                </Label>   

                 <Label text="----------------------------------------" horizontalAlignment="center" />


                <Label class="infoSmall" v-for="file in this.getDBLinkFiles" :key="file" horizontalAlignment="left" >
                   <FormattedString>
                        <Span class="faSmall" text.decode=" &#xf016; "/> <!-- https://fontawesome.com/v3.2.1/cheatsheet/ -->
                        <Span :text="file"/>
                    </FormattedString>
                </Label>
            </StackLayout>
        </ScrollView>
    </Page>
</template>

<script>

import Tracer from '../common/Tracer';
import TypeDefUtil from '../common/TypeDefUtil';

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