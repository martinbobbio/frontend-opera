<template>
    <v-layout justify-center align-center>
        <v-flex xs12 sm8 md6 lg5 xl4>
            <v-card v-if="email" class="elevation-6">
                <v-toolbar color="primary" dark card>
                    <v-toolbar-title>Nueva Contraseña</v-toolbar-title>
                </v-toolbar>
                <v-card-text class="subheading">
                    Ingresa una nueva contraseña para {{email}}
                </v-card-text>
                <v-card-text>
                    <v-text-field v-model="form.password" label="Password" :error-messages="errorsPassword" @blur="$v.form.password.$touch" type="password"></v-text-field>
                    <v-text-field v-model="form.passwordRepeat" label="Repetir password" :error-messages="errorsPasswordRepeat" @blur="$v.form.passwordRepeat.$touch" type="password"></v-text-field>
                </v-card-text>
                <v-card-text>
                    <v-layout justify-end>
                        <v-btn @click="changePassword" :disabled="$v.form.$invalid" color="secondary">Aceptar</v-btn>
                    </v-layout>
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>
</template>


<script>

import { required, minLength, maxLength, sameAs } from 'vuelidate/lib/validators'
import { auth } from '@/firebase'
import { mapMutations } from 'vuex'

export default {
    data(){
        return{
            actionCode: '',
            email: '',
            form:{
                password: '',
                passwordRepeat: ''
            },
        }
    },
    validations:{
        form:{
            password:{
                required,
                minLength: minLength(6),
                maxLength: maxLength(20),
            },
            passwordRepeat:{
                required,
                minLength: minLength(6),
                maxLength: maxLength(20),
                sameAs: sameAs('password')
            }
        },
    },
    methods: {
        ...mapMutations(['showCheckAuth', 'hideCheckAuth', 'showNotification']),
        ...mapMutations('session', ['refreshUser']),
        async validation() {
            let mode = this.$route.query.mode
            this.actionCode = this.$route.query.oobCode

            switch(mode){
                case 'verifyEmail':
                    this.showCheckAuth({title: 'Verificando Código', message: 'Validando el código de verificación'})
                    try {
                        await auth.applyActionCode(this.actionCode)
                        this.showNotification({message : 'Email validado con éxito. Ingresa tus credenciales', color: 'success'})
                        this.$router.push({ name:'login' })
                    }
                    catch(error){
                        this.showNotification({message : 'No fue posible validar tu email', color: 'error'})
                    }
                    finally{
                        this.hideCheckAuth()
                    }
                    break
                case 'resetPassword':
                    this.showCheckAuth({title: 'Verificando Código', message: 'Validando el código para restablecer la contraseña'})
                    try {
                        this.email = await auth.verifyPasswordResetCode(this.actionCode)
                    }
                    catch(error){
                        this.showNotification({message : 'Hubo un error verificando el código', color: 'error'})
                    }
                    finally{
                        this.showNotification({message : `Ingresa una nueva contraseña para ${this.email}`, color: 'info'})
                        this.hideCheckAuth()
                    }
                    break
            }
        },
        async changePassword(){
            this.showCheckAuth({title: 'Estableciendo contraseña', message: 'Cambiando contraseña'})
            try {
                await auth.confirmPasswordReset(this.actionCode, this.form.password)
                let credentials = await auth.signInWithEmailAndPassword(this.email, this.form.password)

                let id = credentials.user.id
                let user = {
                    id,
                    username: 'rogerfederer',
                    firstname: 'Roger',
                    lastname: 'Federer',
                    gender: 'M',
                    description: 'Su majestad',
                    biography: 'https://es.wikipedia.org/wiki/Roger_Federer',
                    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Federer_RG15_%2855%29_%2819307817335%29.jpg/245px-Federer_RG15_%2855%29_%2819307817335%29.jpg'
                }
                this.refreshUser(user)
                this.showNotification({message : `Bienvenido ${user.firstname}, cambiaste tu contraseña`, color: 'success'})
                this.$router.push({ name: 'home' })
            }
            catch(error){
                this.showNotification({message : 'No fue posible cambiar la contraseña', color: 'error'})
            }
            finally{
                this.hideCheckAuth()
            }
        }
    },
    computed:{
        errorsPassword(){
            let errors = []
            if(!this.$v.form.password.$dirty) { return errors }
            if(!this.$v.form.password.required) { errors.push('Ingresa tu contraseña') }
            if(!this.$v.form.password.minLength) { errors.push('Ingresa al menos 6 caracteres') }
            if(!this.$v.form.password.maxLength) { errors.push('Ingresa máximo 20 caracteres') }
            return errors
        },
        errorsPasswordRepeat(){
            let errors = []
            if(!this.$v.form.passwordRepeat.$dirty) { return errors }
            if(!this.$v.form.passwordRepeat.sameAs) { errors.push('Las contraseñas no coinciden') }
            return errors
        },
    },
    created(){
        this.validation()
    }
}
</script>
