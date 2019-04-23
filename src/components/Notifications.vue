<template>
    <v-snackbar v-model="notification.visible" :color="notification.color" multi-line top :timeout="6000" dark>
      {{notification.message}}
      <v-btn color="white" flat @click="onClose()">Cerrar</v-btn>
    </v-snackbar>
</template>


<script>
export default {
    props: ['notification', 'onClose']
}
</script>
