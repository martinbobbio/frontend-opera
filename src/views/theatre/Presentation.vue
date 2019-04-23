<template>
    <v-layout v-resize="onResize" justify-center align-start>
        <v-layout v-if="presentation && places" column>
            <v-layout v-if="show && theatre" column justify-center text-xs-center my-3 class="secondary--text">
                <h3 class="display-2">{{show.title}}</h3>
                <h4 class="display-1">{{theatre.name}}</h4>
                <h5 class="headline">{{datePresentation}}</h5>
            </v-layout>
            <v-divider></v-divider>
            <v-layout justify-center my-3>
                <v-flex :shrink="true" class="mr-3">
                    <v-layout>
                        <v-icon color="grey darken-3" :size="22">add</v-icon>
                        <span class="ml-2">Asiendo Disponible</span>
                    </v-layout>
                    <v-layout>
                        <v-icon color="grey darken-3" :size="22">person</v-icon>
                        <span class="ml-2">Asiendo Ocupado</span>
                    </v-layout>
                    <v-layout>
                        <v-icon color="grey darken-3" :size="22">check_circle</v-icon>
                        <span class="ml-2">Asiendo Seleccionado</span>
                    </v-layout>
                    <v-layout>
                        <v-icon color="grey darken-3" :size="22">monetization_on</v-icon>
                        <span class="ml-2">Asiendo Pagado</span>
                    </v-layout>
                </v-flex>
                <v-flex :shrink="true" class="ml-3">
                    <div v-for="category in categories" :key="category.price">
                        <v-icon :color="category.color" :size="22">lens</v-icon>
                        <span class="ml-2">$ {{category.price}}</span>
                    </div>
                </v-flex>
            </v-layout>
            <v-divider></v-divider>
            <v-slide-y-transition mode="out-in">
                <v-layout v-if="placesSelected && placesSelected.length > 0" column justify-center text-xs-center my-3>
                    <span class="subheading font-weight-bold">Tu reserva</span>
                    <v-flex mt-3>
                        <v-slide-y-transition group hide-on-leave>
                            <v-chip @input="selectPlace(place)" :close="!place.statusLoading" :color="place.statusLoading ? '#D32F2F' : '#C0CA33'" text-color="white" v-for="place in placesSelected" :key="place.pid">
                                <v-avatar>
                                    <v-icon>check_circle</v-icon>
                                </v-avatar>
                                {{place.description}}: $ {{place.price}}
                            </v-chip>
                        </v-slide-y-transition>
                    </v-flex>
                    <v-layout justify-center mt-2>
                        <v-btn @click="payPlaces" color="secondary" class="subheading">Pagar Total: $ {{placesSelectedPrice.toLocaleString()}}</v-btn>
                    </v-layout>
                </v-layout>
            </v-slide-y-transition>
            <v-divider v-if="placesSelected && placesSelected.length > 0"></v-divider>
            <v-slide-y-transition mode="out-in">
                <v-layout v-if="placesPaid && placesPaid.length > 0" column justify-center text-xs-center my-3>
                    <span class="subheading">Compras Realizadas</span>
                    <v-flex mt-3>
                        <v-slide-y-transition group hide-on-leave>
                            <v-chip v-for="place in placesPaid" :key="place.pid" text-color="grey darken-1">
                                <v-avatar>
                                    <v-icon color="grey darken-1">monetization-on</v-icon>
                                </v-avatar>
                                {{place.description}}: $ {{place.price}}
                            </v-chip>
                        </v-slide-y-transition>
                    </v-flex>
                    <span class="subheading mt-2">Total: $ {{placesPaidPrice.toLocaleString()}}</span>
                </v-layout>
            </v-slide-y-transition>
            <v-divider v-if="placesPaid && placesPaid.length > 0"></v-divider>
            <v-layout justify-center my-3>
                <v-card color="transparent" class="elevation-0">
                    <v-layout justify-center class="stage">
                        <span class="headline">Escenario</span>
                    </v-layout>
                    <div class="places">
                        <v-card v-for="place in places" :key="place.pid" @click.native="selectPlace(place)" class="place" :class="applyCssPlace(place.status)" :color="getColorPlace(place.status, place.color)" :style="`grid-column: ${place.x}; grid-row: ${place.y};`">
                            <v-icon v-if="!place.statusLoading" color="white" :size="size">{{getIconStatus(place.status)}}</v-icon>
                            <v-progress-circular v-else indeterminate :size="size" color="white"></v-progress-circular>
                        </v-card>
                    </div>
                </v-card>
            </v-layout>
        </v-layout>
    </v-layout>
</template>


<script>
import { db } from '@/firebase'
import { mapState, mapMutations } from 'vuex'
import { generateFormatDate, generateFormatHour } from '@/utils/format'

export default {
    data(){
        return{
            presentation:null,
            show:null,
            theatre:null,
            places:null,
            placesSelected:[],
            placesSelectedPrice:0,
            placesPaid:[],
            placesPaidPrice:0,
            categories:null,
            size:27,
        }
    },
    computed:{
        ...mapState('session', ['user']),
        datePresentation(){
            if(!this.presentation){ return '' }
            return generateFormatDate(this.presentation.date.toDate(), '/') + " " + generateFormatHour(this.presentation.date.toDate())
        }
    },
    created(){
        this.loadPresentation()
    },
    methods:{
        ...mapMutations(['showNotification', 'showCheckAuth', 'hideCheckAuth']),
        async loadPresentation(){
            let sid = this.$route.params.showId
            let tid = this.$route.params.theatreId
            let date = this.$route.params.date
            let pid = `${sid}-${tid}-${date}`

            this.showCheckAuth({ title:'Consultando Información', message:'Consultando la información de la presentación'})

            try {
                let theatreDoc = await db.collection('theatres').doc(tid).get()
                if(theatreDoc.exists)this.theatre = theatreDoc.data()
                else{
                    this.$router.push({ name:'404' })
                    return
                }
                let showDoc = await db.collection('shows').doc(sid).get()
                if(showDoc.exists)this.show = showDoc.data()
                else{
                    this.$router.push({ name:'404' })
                    return
                }
                let presentationDoc = await db.collection('shows').doc(sid).collection('presentations').doc(pid).get()
                if(presentationDoc.exists)this.presentation = presentationDoc.data()
                else{
                    this.$router.push({ name:'404' })
                    return
                }

                this.categories = this.theatre.categories.map(c => {
                    return { color:c.color, price: this.show.categories.find(item => item.category === c.category).price }
                })

                this.places = this.theatre.places.map(place => {
                    let price = this.show.categories.find(item => item.category === place.category).price
                    let color = this.theatre.categories.find(item => item.category === place.category).color

                    return { pid:`${place.x}-${place.y}`, category:place.category, status:'available', statusLoading:false, description:place.description, x:place.x, y:place.y, price, color }
                })
                this.checkReservations()

            } catch (error) {
                this.showNotification({ message: error, color: 'error'})
                this.$router.push({ name:'404' })
            }finally{
                this.hideCheckAuth()
            }
        },
        async selectPlace(place){
            if(place.status === 'paid' || place.status === 'ocuppied' || place.statusLoading) return
            place.statusLoading = true

            let batch = db.batch()

            if(place.status === 'available'){
                let reservation = {
                    rid: place.pid,
                    x: place.x,
                    y: place.y,
                    date: new Date(),
                    user:{
                        uid: this.user.uid,
                        firstname: this.user.firstname,
                        lastname: this.user.lastname
                    },
                    status: 'selected'
                }

                let reservationUser = {
                    ruid: `${this.presentation.pid}-${place.pid}`,
                    rid: place.pid,
                    x: place.x,
                    y: place.y,
                    date: new Date(),
                    status: 'selected',
                    presentation: this.presentation
                }

                batch.set(db.collection('shows').doc(this.show.sid).collection('presentations').doc(this.presentation.pid).collection('reservations').doc(reservation.rid), reservation)
                batch.set(db.collection('users').doc(this.user.uid).collection('reservations').doc(reservationUser.ruid), reservationUser)

                try{
                    await batch.commit()
                }catch (error){
                    this.showNotification({ message: error, color: 'error'})
                }finally{
                    place.statusLoading = false
                }
            }else{

                batch.delete(db.collection('shows').doc(this.show.sid).collection('presentations').doc(this.presentation.pid).collection('reservations').doc(place.pid))
                batch.delete(db.collection('users').doc(this.user.uid).collection('reservations').doc(`${this.presentation.pid}-${place.pid}`))

                try{
                    await batch.commit()
                }catch(error){
                    this.showNotification({ message: error, color: 'error'})
                }finally{
                    place.statusLoading = false
                }
            }
        },
        checkReservations(){
            db.collection('shows').doc(this.show.sid).collection('presentations').doc(this.presentation.pid).collection('reservations').onSnapshot(
            snapshot => {
                snapshot.docChanges().forEach(change => {
                    let reservation = change.doc.data()
                    let place = this.places.find(place => place.pid === reservation.rid)
                    if(change.type === 'added' || change.type === 'modified'){
                        if(reservation.user.uid === this.user.uid){
                            place.status = reservation.status
                            if(place.status === 'selected'){
                                this.placesSelected.push(place)
                                this.placesSelectedPrice += place.price
                            }else{
                                this.placesPaid.push(place)
                                this.placesSelectedPrice += place.price
                            }
                        }else{
                            place.status = 'ocuppied'
                        }
                    }else{
                        place.status = 'available'
                        if(reservation.user.uid === this.user.uid){
                            this.placesSelected.splice(this.placesSelected.indexOf(place), 1)
                            this.placesSelectedPrice -= place.price
                        }
                    }
                })
            },
            () => {
                this.showNotification({ message: "Ocurrió un error actualizando el estado de algunos asientos", color: 'success'})
            })
        },
        async payPlaces(){
            this.showCheckAuth({ title:'Efectuando compra', message:'Se está procesando tu pago'})
            
            let batch = db.batch()
            let date = new Date()
            this.placesSelected.forEach(place => {
                batch.update(
                    db.collection('shows').doc(this.show.sid).collection('presentations').doc(this.presentation.pid).collection('reservations').doc(place.pid), { status: 'paid', date}
                )
                batch.update(
                    db.collection('users').doc(this.user.uid).collection('reservations').doc(`${this.presentation.pid}-${place.pid}`), {status:'paid', date}
                )
            })

            

            try{
                await batch.commit()
                this.placesSelected = []
                this.placesSelectedPrice = 0
                this.showNotification({ message: "Tu compra se ha efectuado con éxito. ¡Disfruta el show!", color: 'success'})
            }catch(error){
                this.showNotification({ message: error, color: 'error'})
            }finally{
                this.hideCheckAuth()
            }
        },
        onResize(){
            if(window.innerWidth < 400) this.size = 7
            else if(window.innerWidth < 500) this.size = 9
            else if(window.innerWidth < 600) this.size = 12
            else if(window.innerWidth < 900) this.size = 13
            else if(window.innerWidth < 1000) this.size = 19
            else if(window.innerWidth < 1200) this.size = 24
            else this.size = 27
        },
        getIconStatus(status){
            switch(status){
                case 'available':
                    return 'add'
                case 'selected':
                    return 'check_circle'
                case 'ocuppied':
                    return 'person'
                case 'paid':
                    return 'monetization_on'
            }
        },
        getColorPlace(status, color){
            switch(status){
                case 'available':
                    return color
                case 'selected':
                    return '#C0CA33'
                case 'ocuppied':
                case 'paid':
                    return '#E0E0E0'
            }
        },
        applyCssPlace(status){
            switch(status){
                case 'available':
                case 'selected':
                    return 'pointer elevation-2'
                case 'ocuppied':
                case 'paid':
                    return 'not-allowed elevation-0'

            }
        }
    }
}
</script>


<style>

.places{
    display: grid;
    align-items: center;
    align-content: center;
    justify-items: center;
    justify-content: center;
    grid-gap: 12px;
}
.place{
    display: grid;
    padding:10px;
    border-top-left-radius: 20%;
    border-top-right-radius: 20%;
    border-bottom-left-radius: 40%;
    border-bottom-right-radius: 40%;
}

.stage{
    color:#444;
    border: 1px solid #9e9e9e;
    padding: 30px 0;
    border-bottom-left-radius: 50%;
    border-bottom-right-radius: 50%;
    margin-bottom: 20px
}

.pointer{
    cursor:pointer;
}

.not-allowed{
    cursor:not-allowed;
}

@media only screen and (max-width: 1200px){
    .places{
        grid-gap: 6px;
    }
    .place{
        padding: 8px;
    }
}

@media only screen and (max-width: 1000px){
    .places{
        grid-gap: 8px;
    }
    .place{
        padding: 6px;
    }
}

@media only screen and (max-width: 900px){
    .places{
        grid-gap: 10px;
    }
    .place{
        padding: 6px;
    }
}

@media only screen and (max-width: 600px){
    .places{
        grid-gap: 10px;
    }
    .place{
        padding: 4px;
    }
}

@media only screen and (max-width: 400px){
    .places{
        grid-gap: 4px;
    }
    .place{
        padding: 3px;
    }
}


</style>