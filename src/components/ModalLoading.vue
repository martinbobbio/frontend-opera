<template>
    <v-dialog v-model="options.visible" max-width="400" persistent>
        <v-card>
        <v-toolbar color="primary" dark card>
            <v-toolbar-title>
            {{options.title}}
            </v-toolbar-title>
        </v-toolbar>
        <v-card-text class="subheading">
            {{options.message}}
        </v-card-text>
        <v-card-text>
            <v-progress-linear :indeterminate="true" color="primary"></v-progress-linear>
        </v-card-text>
        </v-card>
    </v-dialog>
</template>


<script>
export default {
    props: ['options']
}
</script>
