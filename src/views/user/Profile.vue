<template>
    <v-layout text-xs-center align-start justify-center class="mt-5">
        <v-card v-if="user" class="elevation-6" max-width="250">
            <v-btn v-if="isYourProfile" @click="edit = !edit" color="secondary" class="elevation-1" fab small absolute top right>
                <v-fade-transition mode="out-in">
                    <v-icon :key="1" v-if="!edit">edit</v-icon>
                    <v-icon :key="2" v-if="edit">close</v-icon>
                </v-fade-transition>
            </v-btn>
            <v-card-text>
                <v-layout justify-center>
                    <v-btn @click="editNamesInit" v-if="edit" color="secondary" flat icon small>
                        <v-icon>edit</v-icon>
                    </v-btn>
                    <div class="ma-2">{{user.firstname}} {{user.lastname}}</div>
                </v-layout>
                <v-img class="ma-2 photoProfile" :src="photoProfile">
                    <v-layout align-end justify-end>
                        <v-btn v-if="edit" :to="{ name: 'profilePhoto' }" outline icon large>
                            <v-icon>edit</v-icon>
                        </v-btn>
                    </v-layout>
                </v-img>
                <v-layout justify-center>
                    <v-btn @click="editDescriptionInit" v-if="edit" color="secondary" flat icon small>
                        <v-icon>edit</v-icon>
                    </v-btn>
                    <div class="ma-2 description">
                        <span v-if="user.description">{{user.description}}</span>
                        <span v-else>Agrega una descripción</span>
                    </div>
                </v-layout>
                <v-layout justify-center>
                    <v-btn @click="editBiographyInit" v-if="edit" color="secondary" flat icon small>
                        <v-icon>edit</v-icon>
                    </v-btn>
                    <div class="ma-2">
                        <a v-if="user.biography" :href="user.biography" target="_blank" class="ma-2 link">Biografia</a>
                        <span v-else>Ingresa tu biografia</span>
                    </div>
                </v-layout>
            </v-card-text>
        </v-card>
        <v-dialog v-model="editNames" max-width="400">
            <v-card>
                <v-toolbar color="primary" dark card>
                    <v-toolbar-title>Modificar nombre y apellido</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-text-field v-model="formNames.firstname" :error-messages="errorsFirstname" @blur="$v.formNames.firstname.$touch" autofocus label="Nombre"></v-text-field>
                    <v-text-field v-model="formNames.lastname" :error-messages="errorsLastname" @blur="$v.formNames.lastname.$touch" label="Apellido"></v-text-field>
                </v-card-text>
                <v-card-text>
                    <v-layout>
                        <v-flex xs6>
                            <v-layout justify-start>
                                <v-btn  @click="editNames = false" color="secondary">Cancelar</v-btn>
                            </v-layout>
                        </v-flex>
                        <v-flex xs6>
                            <v-layout justify-end>
                                <v-btn  @click="saveNames" :disabled="$v.formNames.$invalid" color="secondary">Guardar</v-btn>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog v-model="editDescription" max-width="400">
            <v-card>
                <v-toolbar color="primary" dark card>
                    <v-toolbar-title>Modificar descripción</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-textarea v-model="description" :error-messages="errorsDescription" @blur="$v.description.$touch" counter="300" autofocus label="Descripción"></v-textarea>
                </v-card-text>
                <v-card-text>
                    <v-layout>
                        <v-flex xs6>
                            <v-layout justify-start>
                                <v-btn  @click="editDescription = false" color="secondary">Cancelar</v-btn>
                            </v-layout>
                        </v-flex>
                        <v-flex xs6>
                            <v-layout justify-end>
                                <v-btn  @click="saveDescription" :disabled="$v.description.$invalid" color="secondary">Guardar</v-btn>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog v-model="editBiography" max-width="400">
            <v-card>
                <v-toolbar color="primary" dark card>
                    <v-toolbar-title>Modificar biografráa</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-text-field v-model="biography" :error-messages="errorsBiography" @blur="$v.biography.$touch" autofocus label="Biografía"></v-text-field>
                </v-card-text>
                <v-card-text>
                    <v-layout>
                        <v-flex xs6>
                            <v-layout justify-start>
                                <v-btn  @click="editBiography = false" color="secondary">Cancelar</v-btn>
                            </v-layout>
                        </v-flex>
                        <v-flex xs6>
                            <v-layout justify-end>
                                <v-btn  @click="saveBiography" :disabled="$v.biography.$invalid" color="secondary">Guardar</v-btn>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-layout>
</template>


<script>
import { mapMutations, mapGetters } from 'vuex'
import { required, minLength, maxLength, url } from 'vuelidate/lib/validators'
import { db, auth } from '@/firebase'


export default {
    data(){
        return{
            user: null,
            edit: false,
            editNames: false,
            editDescription: false,
            editBiography: false,
            formNames:{
                firstname: '',
                lastname: ''
            },
            description: '',
            biography:''
        }
    },
    methods:{
        ...mapMutations(['showCheckAuth', 'hideCheckAuth', 'showNotification']),
        ...mapMutations('session', ['refreshNames', 'refreshDescription', 'refreshBiography']),
        editNamesInit(){
            this.editNames = true
            this.formNames.firstname = this.user.firstname
            this.formNames.lastname = this.user.lastname
        },
        editDescriptionInit(){
            this.editDescription = true
            this.description = this.user.description || ''
        },
        editBiographyInit(){
            this.editBiography = true
            this.biography = this.user.biography || ''
        },
        async saveNames(){
            if(this.formNames.firstname === this.user.firstname && this.formNames.lastname === this.user.lastname){
                this.editNames = false
                return
            }
            this.showCheckAuth({ title: 'Actualizando información', message:'Estamos guardando tu nombre y apellido' })

            try{
                await db.collection('users').doc(this.user.uid).update({ firstname:this.formNames.firstname, lastname:this.formNames.lastname })
                this.refreshNames({ firstname:this.formNames.firstname, lastname:this.formNames.lastname })
                this.user.firstname = this.formNames.firstname
                this.user.lastname = this.formNames.lastname
                this.editNames = false
            }catch(error){
                this.showNotification({message : 'Ocurrió un error actualizando tus datos', color: 'error'})
            }finally{
                this.hideCheckAuth()
            }
        },
        async saveDescription(){
            if(this.description === this.user.description){
                this.editDescription = false
                return
            }
            this.showCheckAuth({ title: 'Actualizando información', message:'Estamos guardando tu descripción' })

            try{
                await db.collection('users').doc(this.user.uid).update({ description:this.description })
                this.refreshDescription({ description:this.description })
                this.user.description = this.description
                this.editDescription = false
            }catch(error){
                this.showNotification({message : 'Ocurrió un error actualizando tus datos', color: 'error'})
            }finally{
                this.hideCheckAuth()
            }
        },
        async saveBiography(){
            if(this.biography === this.user.biography){
                this.editBiography = false
                return
            }
            this.showCheckAuth({ title: 'Actualizando información', message:'Estamos guardando tu biografía' })

            try{
                await db.collection('users').doc(this.user.uid).update({ biography:this.biography })
                this.refreshBiography({ biography:this.biography })
                this.user.biography = this.biography
                this.showNotification({message : 'Se ha cambiado la url de la biografía', color: 'success'})
                this.editBiography = false
            }catch(error){
                this.showNotification({message : 'Ocurrió un error actualizando tus datos', color: 'error'})
            }finally{
                this.hideCheckAuth()
            }
        },
        async checkUser(){
            let usernameParams = this.$route.params.username.toLowerCase()
            this.showCheckAuth({ title: 'Consultando Información', message:'Cargando datos' })

            try{
                let usernameDoc = await db.collection('usernames').doc(usernameParams).get()
                if(usernameDoc.exists){
                    let username = usernameDoc.data()
                    let user = await db.collection('users').doc(username.uid).get()

                    if(user.exists){
                        this.user = user.data()
                    }else{
                        this.$router.push({ name: '404' })
                    }
                }else{
                    this.$router.push({ name: '404' })
                }
            }catch{
                this.$router.push({ name: '404' })
            }finally{
                this.hideCheckAuth()
            }
        }
    },
    watch: {
        '$route' (){
            this.checkUser()
        }
    },
    computed:{
        ...mapGetters('session', ['photoProfile']),
        errorsFirstname(){
            let errors = []
            if(!this.$v.formNames.firstname.$dirty) { return errors }
            if(!this.$v.formNames.firstname.required) { errors.push('Ingresa tu nombre') }
            if(!this.$v.formNames.firstname.minLength) { errors.push('Ingresa al menos 3 caracteres') }
            if(!this.$v.formNames.firstname.maxLength) { errors.push('Ingresa máximo 20 caracteres') }
            return errors
        },
        errorsLastname(){
            let errors = []
            if(!this.$v.formNames.lastname.$dirty) { return errors }
            if(!this.$v.formNames.lastname.required) { errors.push('Ingresa tu apellido') }
            if(!this.$v.formNames.lastname.minLength) { errors.push('Ingresa al menos 3 caracteres') }
            if(!this.$v.formNames.lastname.maxLength) { errors.push('Ingresa máximo 20 caracteres') }
            return errors
        },
        errorsDescription(){
            let errors = []
            if(!this.$v.description.$dirty) { return errors }
            if(!this.$v.description.required) { errors.push('Ingresa tu descripción') }
            if(!this.$v.description.maxLength) { errors.push('Ingresa máximo 300 caracteres') }
            return errors
        },
        errorsBiography(){
            let errors = []
            if(!this.$v.biography.$dirty) { return errors }
            if(!this.$v.biography.required) { errors.push('Ingresa tu url') }
            if(!this.$v.biography.url) { errors.push('Ingresa una url válida') }
            return errors
        },
        isYourProfile(){
            return this.user && this.user.uid === auth.currentUser.uid
        }
    },
    validations:{
        formNames:{
            firstname:{
                required,
                minLength: minLength(3),
                maxLength: maxLength(20),
            },
            lastname:{
                required,
                minLength: minLength(3),
                maxLength: maxLength(20),
            }
        },
        description:{
            required,
            maxLength: maxLength(300),
        },
        biography:{
            required,
            url,
        }
    },
    created(){
        this.checkUser()
    }
}
</script>



<style>
.photoProfile{
    width: 200px;
    height: 100%;
}
.link{
    text-decoration: none;
    font-size: 1rem;
    color:#553f75;
}
.description{
    text-align: justify;
}
</style>
