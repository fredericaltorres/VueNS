<template>
    <Page class="page">
        <ActionBar class="action-bar">
            <!-- <NavigationButton @tap="$navigateBack()" android.systemIcon="ic_menu_back" /> -->
            <Label class="action-bar-title" text="getRepository.name" horizontalAlignment="center" />
        </ActionBar>
    </Page>
</template>

<script>

    export default {
        props: ["repository"],
        data() {
            console.log(`DATA... name:RepositoryDetails.vue`);
            return {
                name:'RepositoryDetails.vue'
            };
        },
        mounted() {
           console.log(`MOUNTED... name:${this.name}`);
        },
        created() {
            console.log(`CREATED... name:${this.name}, repository:${JSON.stringify(this.repository)}`);
        },
        computed: {
            getRepository() {
                return this.repository || {};
            }
        },
    };
</script>
