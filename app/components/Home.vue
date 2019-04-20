<template>
    <Page class="page">
        <ActionBar class="action-bar">
            <Label class="action-bar-title" :text="`${this.appTitle}`"></Label>
        </ActionBar>
		<ScrollView>
			<StackLayout class="home-panel">

                <!-- https://nativescript-vue.org/en/docs/elements/components/list-picker/ -->
                <!-- <ListPicker id="categoryListPicker" 
                    :items="this.categories" 
                    :selectedIndex="this.categorySelectedIndex" class="p-15 picker" row="1"
                    @selectedIndexChange="categoryListPicker_selectedIndexChange"
                /> -->

			   <Label class="labelInfoTopBar" horizontalAlignment="center" verticalAlignment="center">
                    <FormattedString>
                        <Span class="fa" text.decode="&#xf05a; "/> <!-- https://fontawesome.com/v3.2.1/cheatsheet/ -->
                        <Span :text="`${DBLinks.length} links - Category: ${this.category} - ${this.appStatus}`"/>
                    </FormattedString>
                </Label>                

                <ListView for="dbLink in DBLinks" @itemTap="onItemTap" left="2" top="2" height="400" width="100%" >
                    <v-template>
                        <!-- https://docs.nativescript.org/ui/layouts/layout-containers -->
                        <GridLayout class="list-group-item" rows="auto,*" columns="auto,*">

                            <!-- <Image rowSpan="2" left="2" height="50" row="0" col="0" src="~/images/i.png" class="listView-Image" />
                             -->
                             
                            <Label rowSpan="2" row="0" col="0" class="fa" text.decode=" &#xf0c1; "/><!-- https://fontawesome.com/v3.2.1/cheatsheet/ -->

                            <Label class="listView-Item-Title" row="0" col="1" :text="` ${dbLink.description}`" /> 
                            <Label class="listView-Item-Description" row="1" col="1" :text="` ${dbLink.category}, ${Object.values(dbLink.files).length} file(s)`" />
                        </GridLayout>
                    </v-template>
			    </ListView>

				<Button class="btn btn-primary" text="Category" @tap="onCategoryClick" />
			</StackLayout>
		</ScrollView>
    </Page>
</template>

<script>
    const { alert, confirm, prompt, login, action, inputType } = require("tns-core-modules/ui/dialogs");
 
    import firebaseManagerNS from '../common/FirebaseManagerNS';
    import DBLinkComponent from "./DBLinkComponent.vue";
    import Tracer from '../common/Tracer';

    const APP_TITLE = "dbLinks App";
    const repoUrl = "https://api.github.com/users/fredericaltorres/repos";
    
    export default {
        data() {
            return {
                name:'Home.vue',
                appTitle : APP_TITLE,
                appStatus: "Loading...",
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
            // categoryListPicker_selectedIndexChange(picker) {
            //     this.categorySelectedIndex = picker.object.selectedIndex;
            //     Tracer.log(`categoryListPicker_selectedIndexChange:${this.selectedCategory}`);
            //     this.monitorDBLinks();
            // },
            setAppStatus({ busy }) {
                if(busy) {
                    this.appStatus = "Loading...";
                }
                else {
                    this.appStatus = "Ready";
                }
            },
            onCategoryClick() {
                action("Select a category", "Cancel", this.categories)
                .then(selectedCategory => {
                    this.category = selectedCategory;
                    Tracer.log(`category:${this.category}`, this);
                    this.monitorDBLinks();
                });
            },
            onItemTap(args) {
                const dbLink = this.DBLinks[args.index];
                Tracer.log(`OPEN dbLink:${dbLink.description}`,this);
                this.$navigateTo(DBLinkComponent, { props: { dbLink: dbLink } });  // https://docs.nativescript.org/core-concepts/navigation
            },
            monitorDBLinks() {
                this.setAppStatus({ busy: true });
                const DBLinksCollectionName = 'DBLinks';
                firebaseManagerNS.monitorQuery(
                    DBLinksCollectionName,
                    (dbLinks) => { 
                        Tracer.log(`Collection ${DBLinksCollectionName} change detected, ${dbLinks.length} record(s)`, this);
                        this.DBLinks = dbLinks;
                        this.setAppStatus({ busy: false });
                    },
                    'category', undefined, undefined, 
                    firebaseManagerNS.whereClause('category', this.selectedCategory, 'All')
                );
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
            selectedCategory() {
                return this.category;
            },
            message() {
                return "computed";
            }
        }
    };


 
        //    fetch(repoUrl).then(response => response.json()).then(repoArray => {
        //        console.log(`${repoArray.length} repository found`);
        //        this.repository = repoArray;
        //        this.appStatus = "Rdy";
        //        console.log(`Loaded data ${new Date()}`);
        //    });   
</script>

<style scoped lang="scss">
    // Start custom common variables
    @import '../app-variables';
    // End custom common variables

    // Custom styles

    .labelInfoTopBar {
        padding-left: 6;
        padding-right: 6;
        padding-bottom: 6;
        padding-top: 6;  
        background-color: rgb(235, 230, 230);   
        width: 100%; 
    }
    .fa {
        color: $accent-dark;
        font-size: 25;
    }
    .info {
        font-size: 20;
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

