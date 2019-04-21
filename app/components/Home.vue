<template>
    <Page class="page">
        <ActionBar class="action-bar">
            <Label class="action-bar-title" :text="`${this.appTitle}`"></Label>
        </ActionBar>
		<ScrollView>
			<StackLayout class="home-panel">

			   <Label class="labelInfoTopBar" horizontalAlignment="center" verticalAlignment="center">
                    <FormattedString>
                        <Span class="fa" text.decode="&#xf05a;  "/> <!-- https://fontawesome.com/v3.2.1/cheatsheet/ -->
                        <Span :text="`${DBLinks.length} links - Category: ${this.category} - ${this.appStatus}`"/>
                    </FormattedString>
                </Label>                

                <ListView for="dbLink in DBLinks" @itemTap="onDBLinkSelectedInListView" left="2" top="2" height="400" width="100%" >
                    <v-template>
                        <!-- https://docs.nativescript.org/ui/layouts/layout-containers -->
                        <GridLayout class="list-group-item" rows="auto,*" columns="auto,*">

                            <Label rowSpan="2" row="0" col="0" class="fa" text.decode=" &#xf0c1; "/><!-- https://fontawesome.com/v3.2.1/cheatsheet/ -->
                            <Label class="listView-Item-Title" row="0" col="1" :text="` ${dbLink.description}`" /> 
                            <Label class="listView-Item-Description" row="1" col="1" :text="` ${dbLink.category}, ${Object.values(dbLink.files).length} file(s)`" />
                        </GridLayout>
                    </v-template>
			    </ListView>

                <GridLayout columns="*,*" rows="auto">
          
                    <Button row="0" col="0" :isEnabled="!this.isBusy" class="btn btn-primary" text="Category" @tap="onCategoryClick" />
                    <Button row="0" col="1" :isEnabled="!this.isBusy" class="btn btn-primary" text="Actions" @tap="onActionsClick" />
                </GridLayout>
            </StackLayout>
		</ScrollView>
    </Page>
</template>

<script>
    const { alert, confirm, prompt, login, action, inputType } = require("tns-core-modules/ui/dialogs");
 
    import firebaseManagerNS from '../common/FirebaseManagerNS';
    import DBLinkComponent from "./DBLinkComponent.vue";
    import Tracer from '../common/Tracer';

    const AppStatus = {
        Busy : 'Loading...',
        Ready : 'Ready'
    }

    const APP_TITLE = "dbLinks";
    const repoUrl = "https://api.github.com/users/fredericaltorres/repos";
    const CANCEL_OPTION = "Cancel";
    
    export default {
        data() {
            return {
                name:'Home.vue',
                appTitle : APP_TITLE,
                appStatus: AppStatus.Busy,
                showMore: true,
                DBLinks:[],
                category: 'All',
                categories: [`All`,`Hardware`,`Software`,`Other`],
            }
        },
        components: {
            DBLinkComponent
        },
        methods: {
            setAppStatus({ busy }) {
                if(busy) {
                    this.appStatus = AppStatus.Busy;
                }
                else {
                    this.appStatus = AppStatus.Ready;
                }
            },
            onCategoryClick() {
                action("Select a category", CANCEL_OPTION, this.categories)
                .then(selectedCategory => {
                    if(selectedCategory !== CANCEL_OPTION) {
                        this.category = selectedCategory;
                        this.monitorDBLinks();
                    }
                });
            },
            onActionsClick() {
                action("Select an actions", CANCEL_OPTION, ['Login','New'])
                .then(selectedAction => {
                    if(selectedAction !== CANCEL_OPTION) {
                        switch(selectedAction) {
                            case 'Login' : 
                                firebaseManagerNS.usernamePasswordLogin('fredericaltorres2@gmail.com', 'abcd1234');
                            break;
                        }
                    }
                });
            },            
            onDBLinkSelectedInListView(args) {
                const dbLink = this.DBLinks[args.index];
                Tracer.log(`OPEN dbLink:${dbLink.description}`,this);
                this.$navigateTo(DBLinkComponent, { props: { dbLink: dbLink } });  // https://docs.nativescript.org/core-concepts/navigation
            },
            monitorDBLinks() {
                Tracer.log(`Start loading dbLink category:${this.category}`, this);
                this.setAppStatus({ busy: true });
                const DBLinksCollectionName = 'DBLinks';
                firebaseManagerNS.monitorQuery(
                    DBLinksCollectionName,
                    (dbLinks) => { 
                        Tracer.log(`Collection ${DBLinksCollectionName} change detected, ${dbLinks.length} record(s)`, this);
                        this.DBLinks = dbLinks;
                        this.setAppStatus({ busy: false });
                        Tracer.log(`End loading dbLink category:${this.category}`, this);
                    },
                    'category', undefined, undefined, 
                    firebaseManagerNS.whereClause('category', this.selectedCategory, 'All')
                );
                Tracer.log(`Start2 loading dbLink category:${this.category}`, this);
            }
        },
        created() {
            this.monitorDBLinks();
        },
        mounted() {
        },
        destroyed() {
        },
        computed: {
            isBusy () {
                return this.appStatus === AppStatus.Busy;
            },
            selectedCategory() {
                return this.category;
            },
            message() {
                return "computed";
            }
        }
    };
</script>

<style scoped lang="scss">
    @import '../app-variables';
    @import '../app-common';
    @import './app-component';

    .labelInfoTopBar {
        padding-left: 6;
        padding-right: 6;
        padding-bottom: 6;
        padding-top: 6;  
        background-color: $Gray-Background;   
        width: 100%; 
    }

    .btn {
        font-size: 20;
        font-weight: bold;
    }
    .listView-Image {
        padding-left: 4;
        padding-right: 4;
        padding-bottom: 4;
        padding-top: 4;
    }
    .listView-Item-Title {
         font-weight: bold;
         height: 32;
         padding-top: 4;
    }
    .listView-Item-Description {
         height: 26;
         padding-bottom: 4;
    }
    .list-group-item {
        // margin-left: 4
    }
</style>

