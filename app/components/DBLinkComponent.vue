        <template>
    <Page class="page">
         <!-- <ActionBar title="Friends" /> -->
        <ActionBar class="action-bar">
            <!-- <NavigationButton @tap="$navigateBack()" android.systemIcon="ic_menu_back" />  -->
            <Label class="action-bar-title" :text="getDBLink.description" horizontalAlignment="center" />
       
        </ActionBar>

        <ScrollView>
            <StackLayout>

                <!-- https://docs.nativescript.org/angular/ui/ng-ui-widgets/formatted-string -->
                <Label class="info" horizontalAlignment="left" verticalAlignment="center">
                    <FormattedString>
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
                <Label class="info" horizontalAlignment="left" verticalAlignment="center">
                    <FormattedString>
                        <Span text="Last Updated: "/>
                        <Span color="#990000" fontAttributes="Bold" :text="this.getDBLinkUpdateAt"/>
                    </FormattedString>
                </Label> 

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
        Tracer.log(`DATA... name:RepositoryDetails.vue`, this);
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
    // Start custom common variables
    @import '../app-variables';
    // End custom common variables

    .info {
        font-size: 20;
        height: 30;
    }
    
    
</style>