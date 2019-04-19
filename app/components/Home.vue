<template>
    <Page class="page">
        <ActionBar class="action-bar">
            <Label class="action-bar-title" :text="appTitle"></Label>
        </ActionBar>
		<ScrollView>
			<StackLayout class="home-panel">

                <!-- https://nativescript-vue.org/en/docs/elements/components/list-picker/ -->
                <ListPicker id="categoryListPicker" :items="this.categories" :selectedIndex="0" class="p-15 picker" row="1"
              
                @selectedIndexChange="categoryListPicker_selectedIndexChange"
                />

                <ListView for="dbLink in DBLinks" @itemTap="onItemTap" left="2" top="2" height="400" width="100%" >
                    <v-template>
                        <!-- https://docs.nativescript.org/ui/layouts/layout-containers -->
                        <GridLayout class="list-group-item" rows="auto,*" columns="auto,*">

                            <Image rowSpan="2" left="2" height="50" row="0" col="0" src="~/images/i.png" class="listView-Image" />
                            <Label class="listView-Item-Title" row="0" col="1" :text="` ${dbLink.description}`" /> 
                            <Label class="listView-Item-Description" row="1" col="1" :text="` ${dbLink.category}, ${Object.values(dbLink.files).length} file(s)`" />
                        </GridLayout>
                    </v-template>
			    </ListView>

			   <Label class="info" horizontalAlignment="center" verticalAlignment="center">
                    <FormattedString>
                        <Span class="fa" text.decode="&#xf135; "/>
                        <Span :text="`${DBLinks.length} links`"/>
                    </FormattedString>
                </Label>
				<Button class="btn btn-primary" text="Alert Me" @tap="alert" />
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
                categorySelectedIndex:0,
            }
        },
        components: {
            DBLinkComponent
        },
        methods: {
            categoryListPicker_selectedIndexChange(picker) {
                this.categorySelectedIndex = picker.object.selectedIndex;
                Tracer.log(`categoryListPicker_selectedIndexChange:${this.selectedCategory}`);
                this.monitorDBLinks();
            },
            alert() {
                this.message = "YesYes";
                alert({title: this.appTitle, message: `Alert Me Clicked`, okButtonText: "OK"});
            },
            onItemTap(args) {
                const dbLink = this.DBLinks[args.index];
                Tracer.log(`OPEN dbLink:${dbLink.description}`,this);
                this.$navigateTo(DBLinkComponent, { props: { dbLink: dbLink } });  // https://docs.nativescript.org/core-concepts/navigation
            },
            monitorDBLinks() {
                const DBLinksCollectionName = 'DBLinks';
                firebaseManagerNS.monitorQuery(
                    DBLinksCollectionName,
                    (dbLinks) => { 
                        Tracer.log(`Collection ${DBLinksCollectionName} change detected, ${dbLinks.length} record(s)`, this);
                        this.DBLinks = dbLinks;
                        this.appStatus = "";
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
                return this.categories[this.categorySelectedIndex];
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
    .fa {
        color: $accent-dark;
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

