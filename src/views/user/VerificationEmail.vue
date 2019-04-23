<template>
    <v-layout align-center justify-center>
        <v-flex xs12 sm8 md6 lg5 xl4>
            <v-card>
                <v-toolbar color="primary" dark card>
                    <v-toolbar-title>Confirma tu dirección de correo</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <span class="subheading">Te hemos enviado un correo de verificación a tu email</span>
                </v-card-text>
                <v-card-text>
                    <v-btn color="secondary" @click="sendEmail">Reenviar Email</v-btn>
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>
</template>


<script>
import { auth } from '@/firebase'
import { mapMutations } from 'vuex'


export default {
    methods:{
        ...mapMutations(['showNotification']),
        async sendEmail(){
            try{
                await auth.currentUser.sendEmailVerification()
                this.showNotification({ message: 'Se ha enviado el correo de verificación', color: 'success'})
                this.$router.push({ name:'home' })
            }catch(error){
                this.showNotification({ message: 'Ocurrio un error enviando el email, intentalo nuevamente', color: 'error'})
            }
        }
    }
}
</script>

