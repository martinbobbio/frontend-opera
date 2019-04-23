<template>
    <v-layout justify-center align-center>
        <v-flex xs12 sm8 md6 lg5 xl4>
            <v-card>
                <v-toolbar color="primary" dark card>
                    <v-toolbar-title>Ingresa</v-toolbar-title>
                </v-toolbar>
                <v-card-text class="subheading text-xs-center">
                    Ingresa con tus redes sociales
                </v-card-text>
                <v-card-text>
                    <v-layout justify-center>
                        <a @click="login('google')" class="mx-3">
                            <v-avatar tile>
                                <img src="https://img.icons8.com/color/96/000000/google-logo.png" alt="Ingreso Google"/>
                            </v-avatar>
                        </a>
                        <a @click="login('facebook')" class="mx-3">
                            <v-avatar tile>
                                <img src="https://img.icons8.com/color/96/000000/facebook.png" alt="Ingreso Facebook"/>
                            </v-avatar>
                        </a>
                    </v-layout>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-text class="subheading text-xs-center">
                    Ingresa con tu email y contraseña
                </v-card-text>
                <v-card-text>
                    <v-text-field label="Email" v-model="form.email" :error-messages="errorsEmail" autofocus="" @blur="$v.form.email.$touch()"></v-text-field>
                    <v-text-field label="Password" v-model="form.password" :error-messages="errorsPassword" @keyup.enter="login('email')" @blur="$v.form.password.$touch()" type="password"></v-text-field>
                </v-card-text>
                <v-card-text>
                    <v-layout justify-end>
                        <v-btn @click="login('email')" :disabled="$v.form.$invalid" color="secondary">Ingresar</v-btn>
                    </v-layout>
                </v-card-text>
                <v-card-actions>
                    <v-btn flat color="secondary" @click="modalPassword = true">¿Olvidaste tu contraseña?</v-btn>
                </v-card-actions>
                <v-card-actions>
                    <v-btn flat color="secondary" :to="{ name:'register'}">¿No tienes cuenta? Regístrate</v-btn>
                </v-card-actions>
            </v-card>
            <v-dialog v-model="modalPassword" max-width="400" persistent="">
                <v-card>
                    <v-toolbar color="primary" dark card>
                        <v-toolbar-title>
                            Restablecer Contraseña
                        </v-toolbar-title>
                    </v-toolbar>
                    <v-card-text class="subheading">
                        Ingresa la dirección de email con la cual te registraste.
                    </v-card-text>
                    <v-card-text>
                        <v-text-field label="Email" v-model="resetPassword" :error-messages="errorsResetPassword" autofocus @blur="$v.resetPassword.$touch()"></v-text-field>
                    </v-card-text>
                    <v-card-text>
                        <v-layout>
                            <v-flex xs6>
                                <v-layout justify-start>
                                    <v-btn @click="modalPassword = false">Cancelar</v-btn>
                                </v-layout>
                            </v-flex>
                            <v-flex xs6>
                                <v-layout justify-end>
                                    <v-btn color="secondary" @click="sendResetPassword" :disabled="$v.resetPassword.$invalid">Enviar</v-btn>
                                </v-layout>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-flex>
    </v-layout>
</template>


<script>

import { required, email, minLength, maxLength } from 'vuelidate/lib/validators'
import { mapMutations } from 'vuex'
import { auth, firebase } from '@/firebase'

export default {
    data(){
        return{
            form:{
                email: '',
                password: ''
            },
            modalPassword : false,
            resetPassword: ''
        }
    },
    validations:{
        form:{
            email:{
                required,
                email
            },
            password:{
                required,
                minLength: minLength(6),
                maxLength: maxLength(20)
            }
        },
        resetPassword:{
            required,
            email
        }
    },
    methods:{
        ...mapMutations(['showCheckAuth', 'hideCheckAuth', 'showNotification']),
        ...mapMutations('session', ['refreshUser']),
        login(method){
            switch(method){
                case 'email':
                    this.loginEmail()
                    break
                case 'facebook':
                    this.loginFacebook()
                    break
                case 'google':
                    this.loginGoogle()
                    break
            }
        },
        async loginEmail(){
            if(!this.$v.form.$invalid){

                this.showCheckAuth({title: 'Validando Credenciales', message: 'Estamos validando tus datos...'})
                
                try{
                    await auth.signInWithEmailAndPassword(this.form.email, this.form.password)
                }catch(error){
                    switch(error.code){
                        case 'auth/user-not-found':
                            this.showNotification({ message: 'Usuario no válido. Revisa tu email y contraseña', color: 'error'})
                            break
                        case 'auth/wrong-password':
                            this.showNotification({ message: 'Usuario no válido. Revisa tu email y contraseña', color: 'error'})
                            break
                        default:
                            this.showNotification({ message: 'Ocurrio un error, intenta nuevamente', color: 'error'})
                    }
                }finally{
                    this.hideCheckAuth()
                }

            }
            else this.$v.form.$touch()
        },
        async loginFacebook(){
            let provider = new firebase.auth.FacebookAuthProvider()
            provider.setCustomParameters({'display' : 'popup'})
            auth.languageCode = 'es_AR'

            try{
                await auth.signInWithPopup(provider)
            }catch(error){
                this.showNotification({ message: 'Ocurrio un error con Facebook', color: 'error'})
            }
        },
        async loginGoogle(){
            let provider = new firebase.auth.GoogleAuthProvider()
            provider.setCustomParameters({'display' : 'popup'})
            auth.languageCode = 'es_AR'

            try{
                await auth.signInWithPopup(provider)
            }catch(error){
                this.showNotification({ message: 'Ocurrio un error con Facebook', color: 'error'})
            }
        },
        async sendResetPassword(){
            this.modalPassword = false
            this.showCheckAuth({title: 'Enviando solicitud', message: 'Enviando solicitud de restablecimiento de contraseña'})
            try{
                await auth.sendPasswordResetEmail(this.resetPassword)
                this.showNotification({message : 'Se ha enviado la solicitud de restablecimiento de contraseña', color: 'success'})
            }catch(error){
                this.showNotification({message : 'Ocurrio un error enviando la solicitud', color: 'error'})
            }finally{
                this.hideCheckAuth()
            }
        }
    },
    computed:{
        errorsEmail(){
            let errors = []
            if(!this.$v.form.email.$dirty) { return errors }
            if(!this.$v.form.email.required) { errors.push('Ingresa tu email') }
            if(!this.$v.form.email.email) { errors.push('No es un email válido') }
            return errors
        },
        errorsPassword(){
            let errors = []
            if(!this.$v.form.password.$dirty) { return errors }
            if(!this.$v.form.password.required) { errors.push('Ingresa tu contraseña') }
            if(!this.$v.form.password.minLength) { errors.push('Ingresa al menos 6 caracteres') }
            if(!this.$v.form.password.maxLength) { errors.push('Ingresa máximo 20 caracteres') }
            return errors
        },
        errorsResetPassword(){
            let errors = []
            if(!this.$v.resetPassword.$dirty) { return errors }
            if(!this.$v.resetPassword.required) { errors.push('Ingresa tu email') }
            if(!this.$v.resetPassword.email) { errors.push('No es un email válido') }
            return errors
        }
    },
}
</script>
