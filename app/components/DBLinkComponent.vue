<template>
    <Page class="page">
        <ActionBar class="action-bar">
            <Label class="action-bar-title" :text="getDBLink.description" horizontalAlignment="center" />
        </ActionBar>

        <ScrollView>
            <StackLayout>

                <!-- https://nativescript-vue.org/en/docs/elements/components/text-view/ -->
                <!-- <TextView class="info" :text="getDBLink.description" editable="false" /> -->

                <!-- https://docs.nativescript.org/angular/ui/ng-ui-widgets/formatted-string -->
                <Label class="info" horizontalAlignment="left" verticalAlignment="center">
                    <FormattedString>
                        <Span class="fa" text.decode=" &#xf0c1; "/> <!-- https://fontawesome.com/v3.2.1/cheatsheet/ -->
                        <Span color="#990000" fontAttributes="Bold" :text="getDBLink.description"/>
                    </FormattedString>
                </Label>
                 <Label class="info" horizontalAlignment="left" verticalAlignment="center">
                    <FormattedString>
                        <Span text="Link: "/>
                        <Span color="#990000" fontAttributes="Bold" :text="getDBLink.link"/>
                    </FormattedString>
                </Label>
                <Label class="info" horizontalAlignment="left" verticalAlignment="center">
                    <FormattedString>
                        <Span text="Category: "/>
                        <Span color="#990000" fontAttributes="Bold" :text="getDBLink.category"/>
                    </FormattedString>
                </Label>
                <Label horizontalAlignment="left" verticalAlignment="center">
                    <FormattedString>
                        <Span text="Last Updated: "/>
                        <Span color="#990000" fontAttributes="Bold" :text="this.getDBLinkUpdateAt"/>
                    </FormattedString>
                </Label> 

 <Label text="----------------------------------------" horizontalAlignment="center" />

                <Label horizontalAlignment="left" verticalAlignment="center">
                    <FormattedString>
                        <Span text="Files: "/>
                        <Span color="#990000" fontAttributes="Bold" :text="this.getDBLinkFiles.length"/>
                    </FormattedString>
                </Label>   

                <Label v-for="file in this.getDBLinkFiles" :key="file" :text="file" horizontalAlignment="left" />
                  
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

    // .info {
    //     font-size: 20;
    //     height: 30;
    // }
    // .fa {
    //     color: $accent-dark;
    //     font-size: 25;
    // }
</style>