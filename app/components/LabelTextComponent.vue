<template>
    <StackLayout>
        <Label v-if="this.isLabelDefined" class="textLabel" :text="this.Label" horizontalAlignment="center" verticalAlignment="center"/>
        
        <Label v-if="!this.ScrollHorizontally" class="textData"  :text="this.Text" horizontalAlignment="center" verticalAlignment="center"/>
    
        <ScrollView v-if="this.ScrollHorizontally" orientation="horizontal" scrollBarIndicatorVisible="true">
             <Label class="textData"  :text="this.Text" horizontalAlignment="center" verticalAlignment="center"/>
        </ScrollView>
    
    </StackLayout>
</template>

<script>

import Tracer from '../common/Tracer';

export default {
    props : { // https://vuejs.org/v2/guide/components-props.html
        Label: {
            type:String
        },
        Text: {
            type:String
        },
        ScrollHorizontally : {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            name:'LabelTextComponent.vue'
        };
    },
    mounted() {
    },
    created() {
    },
    methods:{
    },
    computed: {
        isLabelDefined () {
            return new Boolean(this.Label);
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
