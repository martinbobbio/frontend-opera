<template>
    <v-layout column justify-center text-xs-center>
        <div class="home-title ff-primary">
            <h1>Súper Ópera</h1>
        </div>
        <v-layout wrap>
            <v-flex xs12 sm6 md4 lg3 v-for="show in shows" :key="show.sid">
                <v-card class="elevation-5 ma-3" :to="{ name:'show', params:{id:show.sid} }">
                    <v-img :src="show.photo">
                        <v-layout align-end justify-center fill-height>
                            <v-spacer></v-spacer>
                            <v-card-text class="home-title-show">
                                {{show.title}}
                            </v-card-text>
                        </v-layout>
                    </v-img>
                </v-card>
            </v-flex>
        </v-layout>
    </v-layout>
</template>


<script>
import { mapMutations } from 'vuex'
import { db } from '@/firebase'

export default {
    data(){
        return{
            shows: []
        }
    },
    created(){
        this.loadShows()
    },
    methods:{
        ...mapMutations(['showNotification']),
        async loadShows(){
            try{
                let docs = await db.collection('shows').where('status', '==', true).get()
                docs.forEach(doc =>  this.shows.push(doc.data()));
                if(this.shows.length === 0) this.showNotification({ message: 'No hay obras disponibles por ahora', color: 'info'})
            }catch(error){
                this.showNotification({ message: 'Ocurrió un error cargando las obras', color: 'error'})
            }
        }
    }
}
</script>


<style>
.home-title{
    font-size: 2rem;
    color:#553f75;
    text-shadow: 1px 1px 5px #acacac;
}
.home-title-show{
    color:white;
    opacity: 0.9;
    font-size: 2.4rem;
    vertical-align: end;
}
</style>

