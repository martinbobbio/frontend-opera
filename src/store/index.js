import Vue from 'vue'
import Vuex from 'vuex'
import session from './session'
import theatre from './theatre'

Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        notification:{
            visible: false,
            message: '',
            color: 'info '
        },
        checkAuth:{
            visible:false,
            message: '',
            title: '',
        }
    },
    mutations:{
        showNotification(state, payload){
            state.notification.message = payload.message
            state.notification.visible = true
            state.notification.color = payload.color
        },
        hideNotification(state){
            state.notification.visible = false
        },
        showCheckAuth(state, payload){
            state.checkAuth.message = payload.message
            state.checkAuth.title = payload.title
            state.checkAuth.visible = true
        },
        hideCheckAuth(state){
            state.checkAuth.visible = false
        }
    },
    modules: {
        session,
        theatre
    }
})