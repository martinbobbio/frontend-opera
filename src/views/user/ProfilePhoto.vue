<template>
    <v-layout wrap justify-center align-start >
        <v-flex xs12>
            <v-layout justify-center>
                <v-card max-widt="250">
                <v-toolbar color="primary" dark card>
                    <v-toolbar-title>
                        <span v-if="view === 1">Foto de Perfil Actual</span>
                        <span v-if="view === 2">Vista Previa</span>
                    </v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-responsive>
                        <v-img v-if="view === 1" :src="photoProfile"></v-img>
                        <div v-if="view === 2" ref="viewPreview" class="view-preview"></div>
                    </v-responsive>
                </v-card-text>
                <v-card-text>
                    <v-layout v-if="view === 1" justify-center>
                        <v-btn color="secondary" :to="{ name: 'profile', params: {username:user.username} }">Regresar</v-btn>
                    </v-layout>
                    <v-layout v-if="view === 2" justify-center>
                        <v-flex xs6>
                            <v-btn :to="{ name: 'profile', params: {username:user.username} }">Cancelar</v-btn>
                        </v-flex>
                        <v-flex xs6>
                            <v-btn @click="saveImage" color="secondary">Guardar</v-btn>
                        </v-flex>
                    </v-layout>
                </v-card-text>
            </v-card>
            </v-layout>
        </v-flex>
        <v-flex xs12 sm10 md8 lg6 xl4 mt-3>
            <v-card>
                <v-tabs color="primary" dark icons-and-text>
                    <v-tab>Subir Imagen <v-icon>cloud_upload</v-icon></v-tab>
                    <v-tab-item>
                        <file-pond v-if="view === 1" @addfile="uploadImage" class="pointer" label-idle="Selecciona o arrastra una imagen..." accepted-file-types="image/jpeg, image/png" instant-upload="false" labelFileTypeNotAllowed="Agrega una imagen .png o .jpg" fileValidateTypeLabelExpectedTypes="Se esperaba una imagen"></file-pond>
                        <v-responsive v-if="view === 2">
                            <img ref="viewPreviewOriginal" src="" alt="" class="edit-image">
                        </v-responsive>
                    </v-tab-item>
                    <v-tab v-if="photosProfile.length > 1">Galeria <v-icon>photo_library</v-icon></v-tab>
                    <v-tab-item v-if="photosProfile.length > 1">
                        <v-layout wrap justify-start>
                            <v-flex xs6 sm4 lg3 v-for="photo in photosProfile" :key="photo.photoId">
                                <v-card class="ma-3">
                                    <v-card-text>
                                        <v-img :src="photo.url" alt="Foto Perfil"></v-img>
                                        <v-layout class="mt-3">
                                            <v-flex xs6>
                                                <v-layout justify-start>
                                                    <v-icon v-if="photo.url === user.photo" color="green" medium>check_circle</v-icon>
                                                    <v-icon v-else color="grey" @click="selectPhotoProfile(photo.url)" medium>check_circle_outline</v-icon>
                                                </v-layout>
                                            </v-flex>
                                            <v-flex xs6>
                                                <v-layout justify-end>
                                                    <v-icon v-if="photo.url != user.photo" medium @click="askQuestionPhoto(photo)">delete</v-icon>
                                                </v-layout>
                                            </v-flex>
                                        </v-layout>
                                    </v-card-text>
                                </v-card>
                            </v-flex>
                        </v-layout>
                        <v-dialog v-model="questionDelete" max-width="400" persistent>
                            <v-card>
                                <v-card-text>La foto se eliminará permanentemente, ¿Deseas Continuar?</v-card-text>
                                <v-btn color="secondary" flat @click="questionDelete = false">Cancelar</v-btn>
                                <v-btn flat @click="deletePhoto">Eliminar</v-btn>
                            </v-card>
                        </v-dialog>
                    </v-tab-item>
                </v-tabs>
            </v-card>
        </v-flex>
    </v-layout>
</template>


<script>

import { mapState, mapGetters, mapMutations } from 'vuex'
import { db, storage } from '@/firebase'
import vueFilePond from 'vue-filepond'
import filePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import "filepond/dist/filepond.min.css"
import Cropper from 'cropperjs/dist/cropper'
import 'cropperjs/dist/cropper.css'
import uuidv4 from 'uuid/v4'

const FilePond = vueFilePond(filePondPluginFileValidateType)

export default {
    data(){
        return{
            view:1,
            cropper: null,
            photosProfile: [],
            questionDelete:false,
            photoDeleted: null,
        }
    },
    components: { FilePond },
    computed:{
        ...mapState('session', ['user']),
        ...mapGetters('session', ['photoProfile'])
    },
    methods:{
        ...mapMutations(['showCheckAuth', 'hideCheckAuth', 'showNotification']),
        ...mapMutations('session', ['refreshPhoto']),
        uploadImage(error, file){
            if(error){
                this.showNotification({message : 'Ocurrió un error leyendo la imagen.', color: 'error'})
                return
            }
            this.view = 2
            let reader = new FileReader()
            let vm = this
            reader.onloadend = () =>{
                vm.$refs.viewPreviewOriginal.src = reader.result
                vm.cropImage()
            }

            if(file){
                if(file.file){
                    reader.readAsDataURL(file.file)
                }
            }

        },
        cropImage(){
            this.cropper = new Cropper(this.$refs.viewPreviewOriginal, {
                preview : this.$refs.viewPreview,
                aspectRatio: 1,
                modal: false,
                guides: true,
                sized: false,
                zoomable: false,
                highlight: true,
                background: false,
                autoCrop: true,
            })
        },
        async saveImage(){
            this.showCheckAuth({ title: 'Almacenando imagen', message:'Actualizando imagen de perfil' })

            let canvas = this.cropper.getCroppedCanvas()
            let photo = canvas.toDataURL('image/jpeg')
            let photoId = uuidv4()

            try{
                let ref = storage.ref()
                let result = await ref.child(`users/${this.user.uid}/photos-profile/${photoId}.jpg`).putString(photo, 'data_url')
                let url = await result.ref.getDownloadURL()
                let photoProfile = { photoId, date: new Date(), url, uid:this.user.uid }
                await db.collection('users').doc(this.user.uid).collection('profile-photos').doc(photoId).set(photoProfile)
                await db.collection('users').doc(this.user.uid).update({ photo: url})
                this.refreshPhoto(url)
                this.$router.push({name: 'profile', params: {username: this.user.username}})
            }catch{
                this.showNotification({message : 'Ocurrió un error almacenando la imagen.', color: 'error'})
            }finally{
                this.hideCheckAuth()
            }
        },
        async loadPhotosProfile(){
            this.showCheckAuth({ title: 'Consultando galeria', message:'Cargando galeria de imagenes' })
            try{
                let result = await db.collection('users').doc(this.user.uid).collection('profile-photos').orderBy('date', 'desc').get()
                result.docs.forEach(doc =>{
                    this.photosProfile.push(doc.data())
                })
            }catch{
                this.showNotification({message : 'Ocurrió un error consultando la galeria', color: 'error'})
            }finally{
                this.hideCheckAuth()
            }
        },
        async selectPhotoProfile(url){
            this.showCheckAuth({ title: 'Actualizando imagen', message:'Estableciendo foto de perfil' })
            try{
                await db.collection('users').doc(this.user.uid).update({photo:url})
                this.refreshPhoto(url)
            }catch{
                this.showNotification({message : 'Ocurrió un error seleccionando la imagen', color: 'error'})
            }finally{ 
                this.hideCheckAuth()
            }
        },
        askQuestionPhoto(photo){
            this.photoDeleted = photo
            this.questionDelete = true
        },
        async deletePhoto(){
            this.questionDelete = false

            this.showCheckAuth({ title: 'Eliminando imagen', message:'Se esta borrando la imagen' })
            try{
                await db.collection('users').doc(this.user.uid).collection('profile-photos').doc(this.photoDeleted.photoId).delete()
                await storage.ref().child(`users/${this.user.uid}/photos-profile/${this.photoDeleted.photoId}.jpg`).delete()
                let index = this.photosProfile.indexOf(this.photoDeleted)
                this.photosProfile.splice(index, 1)
            }catch(error){
                this.showNotification({message : 'Ocurrió un error eliminando la imagen', color: 'error'})
            }finally{
                this.hideCheckAuth()
            }
        }
    },
    created(){
        this.loadPhotosProfile()
    }
}
</script>


<style>
.filepond--drop-label{
    font-size: 14pt !important;
}

.edit-image{
    width: 100%;
}

.view-preview{
    width: 200px;
    height: 200px;
    overflow: hidden;
    margin:0 auto;
}
</style>
