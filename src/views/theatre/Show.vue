<template>
    <v-layout v-if="show" justify-center text-xs-center>
        <v-flex xs12 sm10 md12 lg8>
            <h4 class="display-1 secondary--text mt-1">¡Reserva tus entradas para</h4>
            <h2 class="display-3 secondary--text mb-3">{{show.title}}</h2>
            <v-layout wrap align-center>
                <v-flex xs12 md6>
                    <v-card class="ma-3">
                        <v-img :src="show.photo"></v-img>
                        <v-card-text class="subheading font-italic text-xs-justify">{{show.description}}</v-card-text>
                    </v-card>
                </v-flex>
                <v-flex xs12 md6>
                    <v-card class="ma-3">
                        <v-date-picker @change="checkHours" :allowed-dates="validateDate" :events="dateActives" :event-color="f => f < dateCurrentText ? 'grey lighten-1' : 'green darken-1'" locale="es-ar" class="elevation-0" v-model="date" :min="dateMin" :max="dateMax" full-width></v-date-picker>
                        <v-card-text>
                            <v-progress-linear v-if="checkingHours" indeterminate></v-progress-linear>
                            <v-layout v-else justify-center text-xs-center>
                                <v-list two-line>
                                    <v-list-tile v-for="(presentation, index) in presentations" :key="index">
                                        <v-list-tile-action>
                                            <v-btn :to="{ path: presentation.url }">Reservar</v-btn>
                                        </v-list-tile-action>
                                        <v-list-tile-content>
                                            <v-list-tile-title>{{presentation.date}}</v-list-tile-title>
                                            <v-list-tile-sub-title>{{presentation.place}}</v-list-tile-sub-title>
                                        </v-list-tile-content>
                                    </v-list-tile>
                                </v-list>
                            </v-layout>
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-flex>
    </v-layout>
</template>


<script>
import { mapMutations } from 'vuex'
import { db } from '@/firebase'
import { generateFormatDate, generateFormatHour } from '@/utils/format'

export default {
    data(){
        return{
            show:null,
            date:null,
            dateMin:null,
            dateMax:null,
            dateCurrent: new Date(),
            dateCurrentText: generateFormatDate(new Date(), '-'),
            dateActives: null,
            checkingHours:false,
            presentations:[]
        }
    },
    methods:{
        ...mapMutations(['showNotification']),
        async loadShow(){
            let sid = this.$route.params.id
            
            try{
                let doc = await db.collection('shows').doc(sid).get()
                if(doc.exists){
                    this.show = doc.data()
                    if(this.show.dates && this.show.dates.length > 0){
                        let dateShows = this.show.dates.map(timestamp => {
                            let date = timestamp.toDate()
                            date.setHours(date.getHours())

                            return date
                        })
                        dateShows.sort((a, b) => { return a - b })
                        let dateMinCurrent = dateShows.find(f => f >= this.dateCurrent)
                        if(dateMinCurrent){
                            this.dateMin = generateFormatDate(dateMinCurrent, '-')
                            this.dateMax = generateFormatDate(dateShows[dateShows.length - 1], '-')
                            
                            this.dateActives = dateShows.map(date => generateFormatDate(date, '-'))
                            this.dateActives = [...new Set(this.dateActives)]

                            this.date = this.dateMin
                            this.checkHours()
                        }
                    }
                }
            }catch(error){
                this.showNotification({ message: error, color: 'error'})
            }finally{
                if(!this.show) this.$router.push({ name:'404'})
            }

        },
        async checkHours(){
            this.checkingHours = true
            let dateStart = new Date(this.date)
            let dateEnd = new Date(dateStart)
            dateEnd.setDate(dateEnd.getDate()+1)

            try{
                let result = await db.collection('shows').doc(this.show.sid).collection('presentations').where('date', '>=', dateStart).where('date', '<', dateEnd).get()
                this.presentations = result.docs.map(doc => {
                    let presentation = doc.data()
                    let datePresentation = presentation.date.toDate()
                    return { pid: presentation.pid, date: `${generateFormatDate(datePresentation, '/')} ${generateFormatHour(datePresentation)}`, place: presentation.theatre.name, url: `${this.show.sid}/${presentation.theatre.tid}/${generateFormatDate(datePresentation, '-', true)}`}
                })
            }catch(error){
                this.showNotification({ message: error, color: 'error'})
            }finally{
                this.checkingHours = false
            }
        },
        validateDate(date){
            if(!this.dateActives) return false
            if(date < this.dateCurrentText) return false
            return this.dateActives.indexOf(date) !== -1
        }
    },
    created(){
        this.loadShow()
    }
}
</script>