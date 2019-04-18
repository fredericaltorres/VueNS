<template>
    <Page class="page" @loaded="onPageLoaded">
        <ActionBar class="action-bar">
            <Label class="action-bar-title" :text="`${appTitle} (${appStatus})`"></Label>
        </ActionBar>
		<ScrollView>
			<StackLayout class="home-panel">

                <ListView for="dbLink in DBLinks" @itemTap="onItemTap"  left="2" top="2" height="370" width="100%" >
                    <v-template>
                        <!-- <Label :text="rep.name" /> -->
                        <!-- https://docs.nativescript.org/ui/layouts/layout-containers -->
                        <GridLayout class="list-group-item" rows="auto,*" columns="*">
                            <!-- <Image row="0" col="0" :src="item.src" class="thumb img-circle" /> -->
                            <Label backgroundColor="white"  class="listView-Item-Title" row="0" col="0" :text="` ${dbLink.description}`" /> 
                            <Label backgroundColor="white" class="listView-Item-Description" row="1" col="0" :text="` ${dbLink.category}, ${Object.values(dbLink.files).length} file(s)`" />
                        </GridLayout>
                    </v-template>
			    </ListView>

<Label text="----" /> 

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
    import RepositoryDetails from "./RepositoryDetails.vue";
    import Tracer from '../common/Tracer';

    //Tracer.coloredConsole = false;
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
            }
        },
        components: {
            RepositoryDetails
        },
        methods:{
            onPageLoaded(args) {
                console.log(`onPageLoaded`, this);
            },
            alert() {
                this.message = "YesYes";
                alert({title: this.appTitle, message: `Alert Me Clicked`, okButtonText: "OK"});
            },
            onItemTap(args) {
                const dbLink = this.DBLinks[args.index];
                //alert({title: this.appTitle, message: `dbLink!:${dbLink.description}`, okButtonText: "OK"});
                Tracer.log(`OPEN dbLink:${dbLink.description}`,this);
                
                // this.$emit("select", selectedRepo);
                // https://docs.nativescript.org/core-concepts/navigation
                this.$navigateTo(RepositoryDetails, { props: { dbLink: dbLink } });
                //console.log(`NAVIGATED Index:${args.index}, Repo:${selectedRepo.name}`);
            },
        },
        created() {
        //    fetch(repoUrl).then(response => response.json()).then(repoArray => {
        //        console.log(`${repoArray.length} repository found`);
        //        this.repository = repoArray;
        //        this.appStatus = "Rdy";
        //        console.log(`Loaded data ${new Date()}`);
        //    });

            const DBLinksCollectionName = 'DBLinks';
            firebaseManagerNS.monitorQuery(DBLinksCollectionName,
            (dbLinks) => { 
                Tracer.log(`Collection ${DBLinksCollectionName} change detected, ${dbLinks.length} record(s)`, this);
                this.DBLinks = dbLinks;
                this.appStatus = "Rdy";
            },
            'createdAt', undefined, undefined, firebaseManagerNS.whereClause('category', 'Software', 'All')
            );
        },
        mounted() {
           console.log(`MOUNTED...`);
        },
        destroyed() {
            console.log(`DESTROYED...`);
        },
        computed: {
            message() {
                return "computed";
            }
        }
    };
</script>

<style scoped lang="scss">
    // Start custom common variables
    @import '../app-variables';
    // End custom common variables

    ListView Label {
		//height: 35;
		// min-height: 48;
	}

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
