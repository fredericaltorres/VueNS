<template>
    <Page class="page">
        <ActionBar class="action-bar">
            <Label class="action-bar-title" :text="`${this.appTitle + ( this.loggedInUser ? ' - '+this.loggedInUser : '')}`"></Label>
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
          
                    <FButton row="0" col="0" :isEnabled="!this.isBusy" Text="Category" :OnClick="this.onCategoryClick" />
                    <FButton row="0" col="1" :isEnabled="!this.isBusy" Text="Actions"  :OnClick="onActionsClick" />
                </GridLayout>
            </StackLayout>
		</ScrollView>
    </Page>
</template>

<script>
    const { alert, confirm, prompt, login, action, inputType } = require("tns-core-modules/ui/dialogs");
    Tracer.coloredConsole = false; // firebaseManager is loaded before app.js
    import firebaseManager from '../common/FirestoreManager';
    import DBLinkComponent from "./DBLinkComponent.vue";
    import FButton from "./FButton.vue";
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
                loggedInUser: null,
            }
        },
        components: {
            DBLinkComponent,
            FButton
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
                action("Select an actions", CANCEL_OPTION, this.authorizedUserActions)
                .then(selectedAction => {
                    if(selectedAction !== CANCEL_OPTION) {
                        Tracer.log(`User action:${selectedAction}`, this);
                        switch(selectedAction) {
                            case 'Log In' : 
                                firebaseManager.usernamePasswordLogin('fredericaltorres2@gmail.com', 'abcd1234')
                                .then(() => { 
                                    this.loggedInUser = firebaseManager.getCurrentUserDisplayName();
                                    Tracer.log(`Main app notified of log in user:${this.loggedInUser}`);
                                    firebaseManager.currentUserHasRoleAsync(`administrator`)
                                    .then((hasRole) => {
                                        Tracer.log(`has role Admin:${hasRole}`);
                                    });
                                });
                            break;
                            case 'Log Out' : 
                                firebaseManager.logOut()
                                .then(() => { 
                                    this.loggedInUser = null;
                                    Tracer.log(`Main app notified of log out user:${this.loggedInUser}`);
                                });
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
                firebaseManager.monitorQuery(
                    DBLinksCollectionName,
                    (dbLinks) => { 
                        Tracer.log(`Collection ${DBLinksCollectionName} change detected, ${dbLinks.length} record(s)`, this);
                        this.DBLinks = dbLinks;
                        this.setAppStatus({ busy: false });
                        Tracer.log(`End loading dbLink category:${this.category}`, this);
                    },
                    'category', undefined, undefined, 
                    firebaseManager.whereClause('category', this.selectedCategory, 'All')
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
            },
            isUserAuthenticated () {
                return this.loggedInUser !== null;
            },
            authorizedUserActions() {
                const actions = [];
                if(this.isUserAuthenticated) {
                    actions.push('Log Out');
                    if(this.isAdministrator)
                        actions.push('New');
                }
                else {
                    actions.push('Log In');
                }
                return actions;
            },
            isAdministrator() {
                return firebaseManager.getCurrentUserLoadedIsAdmin();
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

