<template>
    <StackLayout>
        <Label v-if="this.isLabelDefined" class="textLabel" :text="this.Label" horizontalAlignment="center" verticalAlignment="center"/>
        <Label class="textData"  :text="this.Text" horizontalAlignment="center" verticalAlignment="center"/>
    </StackLayout>
</template>

<script>

import Tracer from '../common/Tracer';

export default {
    props: ["Label", "Text"],
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
