<template>
    <v-layout justify-center align-center>
        <v-flex xs12 sm8 md6 lg5 xl4>
            <v-slide-y-transition mode="out-in" @enter="changeTransition">
                <v-card v-if="view === 1" :key="1" class="elevation-6">
                    <v-toolbar color="primary" dark card>
                        <v-toolbar-title>Registrate</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text class="subheading text-xs-center">
                        Registrate con tus redes sociales
                    </v-card-text>
                    <v-card-text>
                        <v-layout justify-center>
                            <a @click="nextStep(1, 'google.com')" class="mx-3">
                                <v-avatar tile>
                                    <img src="https://img.icons8.com/color/96/000000/google-logo.png" alt="Registro Google"/>
                                </v-avatar>
                            </a>
                            <a @click="nextStep(1, 'facebook.com')" class="mx-3">
                                <v-avatar tile>
                                    <img src="https://img.icons8.com/color/96/000000/facebook.png" alt="Registro Facebook"/>
                                </v-avatar>
                            </a>
                        </v-layout>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-text class="subheading text-xs-center">
                        Registrate con tu email y contraseña
                    </v-card-text>
                    <v-card-text>
                        <v-text-field v-model="formRegister.email" label="Email" :error-messages="errorsEmail" @blur="$v.formRegister.email.$touch"></v-text-field>
                        <v-text-field v-model="formRegister.password" label="Password" :error-messages="errorsPassword" @blur="$v.formRegister.password.$touch" type="password"></v-text-field>
                        <v-text-field v-model="formRegister.passwordRepeat" label="Repetir password" :error-messages="errorsPasswordRepeat" @keyup.enter="nextStep(1, 'password')" @blur="$v.formRegister.passwordRepeat.$touch" type="password"></v-text-field>
                    </v-card-text>
                    <v-card-text>
                        <v-layout justify-end>
                            <v-btn @click="nextStep(1, 'password')" :disabled="$v.formRegister.$invalid" color="secondary">Siguiente</v-btn>
                        </v-layout>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn flat color="secondary" :to="{ name:'login'}">¿Ya tienes cuenta? Ingresa.</v-btn>
                    </v-card-actions>
                </v-card>
                <v-card v-if="view === 2" :key="2" class="elevation-6">
                    <v-toolbar color="primary" dark card>
                        <v-toolbar-title>Ingresa tu nombre y apellido</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-text-field v-model="formNames.username" label="Usuario" :error-messages="errorsUsername" @blur="$v.formNames.username.$touch" autofocus></v-text-field>
                        <v-text-field v-model="formNames.firstname" :error-messages="errorsFirstname" @blur="$v.formNames.firstname.$touch" label="Nombre"></v-text-field>
                        <v-text-field v-model="formNames.lastname" :error-messages="errorsLastname" @keyup.enter="nextStep(2)" @blur="$v.formNames.lastname.$touch" label="Apellido"></v-text-field>
                    </v-card-text>
                    <v-card-text>
                        <v-layout>
                            <v-flex xs6>
                                <v-layout justify-start>
                                    <v-btn  @click="view--" color="secondary">Atrás</v-btn>
                                </v-layout>
                            </v-flex>
                            <v-flex xs6>
                                <v-layout justify-end>
                                    <v-btn  @click="nextStep(2)" :disabled="$v.formNames.$invalid" color="secondary">Siguiente</v-btn>
                                </v-layout>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                </v-card>
                <v-card v-if="view === 3" :key="3" class="elevation-6">
                    <v-toolbar color="primary" dark card>
                        <v-toolbar-title>Fecha de nacimiento</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-layout justify-center>
                            <v-date-picker ref="calendar" :max="dateBirthdayMax" v-model="dateBirthday" reactive locale="es-ar" class="elevation-3"></v-date-picker>
                        </v-layout>
                    </v-card-text>
                    <v-card-text>
                        <v-layout>
                            <v-flex xs6>
                                <v-layout justify-start>
                                    <v-btn  @click="view--" color="secondary">Atrás</v-btn>
                                </v-layout>
                            </v-flex>
                            <v-flex xs6>
                                <v-layout justify-end>
                                    <v-btn  @click="nextStep(3)" :disabled="$v.dateBirthday.$invalid" color="secondary">Registrarse</v-btn>
                                </v-layout>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                </v-card>
            </v-slide-y-transition>
        </v-flex>
    </v-layout>
</template>


<script>
import { required, email, minLength, maxLength, sameAs, alpha } from 'vuelidate/lib/validators'
import { auth, firebase, db } from '@/firebase'
import { mapMutations } from 'vuex'

export default {
    data(){
        return{
            view: 1,
            method: 'password',
            dateBirthdayMax: null,
            dateBirthday: null,
            formRegister:{
                email: '',
                password: '',
                passwordRepeat: ''
            },
            formNames:{
                firstname: '',
                lastname: ''
            },
        }
    },
    validations:{
        formRegister:{
            email:{
                required,
                email
            },
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
        formNames:{
            username:{
                required,
                minLength: minLength(3),
                maxLength: maxLength(20),
                alpha
            },
            firstname:{
                required,
                minLength: minLength(3),
                maxLength: maxLength(20),
                alpha
            },
            lastname:{
                required,
                minLength: minLength(3),
                maxLength: maxLength(20),
                alpha
            }
        },
        dateBirthday:{
            required
        }
    },
    methods:{
        ...mapMutations(['showCheckAuth', 'hideCheckAuth', 'showNotification']),
        ...mapMutations('session', ['refreshUser']),
        nextStep(value, method){
            switch(value){
                case 1:{
                    if(this.$v.formRegister.$invalid && method == 'password'){
                        this.$v.formRegister.$touch()
                        return
                    }else{ 
                        this.method = method
                        this.view++
                    }
                }
                break
                case 2:{
                    if(this.$v.formNames.$invalid){
                        this.$v.formNames.$touch()
                        return
                    }else{ this.view++ }
                }
                break
                case 3:{
                     if(this.$v.dateBirthday.$invalid){
                        this.$v.formBirthday.$touch()
                        return
                    }else{
                        this.register()
                    }
                }
                break
            }
        },
        changeTransition(){
            if(this.view === 3 && !this.dateBirthday){
                this.$refs.calendar.activePicker = 'YEAR'
            }
        },
        async register(){

            let userNotExists = await db.collection('users').doc(this.formNames.username.toLowerCase()).get()

            if(userNotExists.exists){ 
                this.showNotification({message : `${this.formNames.username} ya existe, prueba otro`, color: 'info'})
                this.view = 2
                return
             }

            switch(this.method){
                case 'password':
                    this.registerEmail()
                    break
                case 'facebook.com':
                    this.registerFacebook()
                    break
                case 'google.com':
                    this.registerGoogle()
                    break
            }
        },
        async registerEmail(){
            try{
                this.showCheckAuth({ title: 'Creando Registro', message:'Estamos registrando tu información' })

                let uid = null
                if(auth.currentUser){
                    uid = auth.currentUser.uid
                }else{
                    let cred = await auth.createUserWithEmailAndPassword(this.formRegister.email, this.formRegister.password)
                    uid = cred.user.uid
                }
                await this.saveUser(uid)
                await auth.currentUser.sendEmailVerification()
                this.showNotification({message : `${this.formNames.firstname} te has registrado exitosamente`, color: 'success'})
                this.$router.push({ name: 'verification-email' })
            }catch(error){
                switch(error.code){
                    case 'auth/email-already-in-use':
                        this.showNotification({ message: 'Ya se ha registrado este email, proba otro', color: 'error'})
                        this.view = 1
                        break
                    default:
                        this.showNotification({ message: 'Ocurrio un error, intenta nuevamente', color: 'error'})
                }
            }finally{
                this.hideCheckAuth()
            }
        },
        async registerFacebook(){
            let provider = new firebase.auth.FacebookAuthProvider()
            provider.setCustomParameters({'display' : 'popup'})
            auth.languageCode = 'es_AR'

            try{
                let uid = null
                if(auth.currentUser){
                    uid = auth.currentUser.uid
                }else{
                    let cred = await auth.signInWithPopup(provider)
                    uid = cred.user.uid
                }
                await this.saveUser(uid)
                this.showNotification({message : `Te has registrado con Facebook`, color: 'success'})
                this.$router.push({ name: 'home' })
            }catch(error){
                this.showNotification({ message: 'Ocurrio un error con Facebook', color: 'error'})
            }
        },
        async registerGoogle(){
            let provider = new firebase.auth.GoogleAuthProvider()
            provider.setCustomParameters({'display' : 'popup'})
            auth.languageCode = 'es_AR'

            try{
                let uid = null
                if(auth.currentUser){
                    uid = auth.currentUser.uid
                }else{
                    let cred = await auth.signInWithPopup(provider)
                    uid = cred.user.uid
                }
                await this.saveUser(uid)

                this.showNotification({message : `Te has registrado con Facebook`, color: 'success'})
                this.$router.push({ name: 'home' })
            }catch(error){
                this.showNotification({ message: 'Ocurrio un error con Facebook', color: 'error'})
            }
        },
        async saveUser(uid){
            let user = {
                uid,
                username: this.formNames.username,
                firstname: this.formNames.firstname,
                lastname: this.formNames.lastname,
                dateBirthday: new Date(this.dateBirthday),
                gender: 'M',
                photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Federer_RG15_%2855%29_%2819307817335%29.jpg/245px-Federer_RG15_%2855%29_%2819307817335%29.jpg'
            }
            let username = {
                username: this.formNames.username,
                uid
            }
            
            let batch = db.batch()
            batch.set(db.collection('users').doc(user.uid), user)
            batch.set(db.collection('usernames').doc(this.formNames.username.toLowerCase()), username)

            await batch.commit()

            this.refreshUser(user)
        }
    },
    computed:{
        errorsEmail(){
            let errors = []
            if(!this.$v.formRegister.email.$dirty) { return errors }
            if(!this.$v.formRegister.email.required) { errors.push('Ingresa tu email') }
            if(!this.$v.formRegister.email.email) { errors.push('No es un email válido') }
            return errors
        },
        errorsPassword(){
            let errors = []
            if(!this.$v.formRegister.password.$dirty) { return errors }
            if(!this.$v.formRegister.password.required) { errors.push('Ingresa tu contraseña') }
            if(!this.$v.formRegister.password.minLength) { errors.push('Ingresa al menos 6 caracteres') }
            if(!this.$v.formRegister.password.maxLength) { errors.push('Ingresa máximo 20 caracteres') }
            return errors
        },
        errorsPasswordRepeat(){
            let errors = []
            if(!this.$v.formRegister.passwordRepeat.$dirty) { return errors }
            if(!this.$v.formRegister.passwordRepeat.sameAs) { errors.push('Las contraseñas no coinciden') }
            return errors
        },
        errorsUsername(){
            let errors = []
            if(!this.$v.formNames.username.$dirty) { return errors }
            if(!this.$v.formNames.username.required) { errors.push('Ingresa tu nombre de usuario') }
            if(!this.$v.formNames.username.minLength) { errors.push('Ingresa al menos 3 caracteres') }
            if(!this.$v.formNames.username.maxLength) { errors.push('Ingresa máximo 20 caracteres') }
            if(!this.$v.formNames.username.alpha) { errors.push('Ingresa solo letras') }
            return errors
        },
        errorsFirstname(){
            let errors = []
            if(!this.$v.formNames.firstname.$dirty) { return errors }
            if(!this.$v.formNames.firstname.required) { errors.push('Ingresa tu nombre') }
            if(!this.$v.formNames.firstname.minLength) { errors.push('Ingresa al menos 3 caracteres') }
            if(!this.$v.formNames.firstname.maxLength) { errors.push('Ingresa máximo 20 caracteres') }
            if(!this.$v.formNames.firstname.alpha) { errors.push('Ingresa solo letras') }
            return errors
        },
        errorsLastname(){
            let errors = []
            if(!this.$v.formNames.lastname.$dirty) { return errors }
            if(!this.$v.formNames.lastname.required) { errors.push('Ingresa tu apellido') }
            if(!this.$v.formNames.lastname.minLength) { errors.push('Ingresa al menos 3 caracteres') }
            if(!this.$v.formNames.lastname.maxLength) { errors.push('Ingresa máximo 20 caracteres') }
            if(!this.$v.formNames.lastname.alpha) { errors.push('Ingresa solo letras') }
            return errors
        },
    },
    created(){
        this.dateBirthdayMax = new Date(new Date().setFullYear(new Date().getFullYear() - 13)).toISOString().substr(0, 10)


        if(auth.currentUser && !this.$store.state.session.user){
            this.method = auth.currentUser.providerData[0].providerId
            this.view = 2
            this.$store.commit('showNotification', { message: 'Completa tus datos del registro', color: 'info'})
        }
    }
}
</script>

