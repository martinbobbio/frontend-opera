import Vue from 'vue'
import store from './store'
import router from './router'
import './plugins/vuetify'
import App from './App.vue'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import Vuelidate from 'vuelidate'
import { auth } from './firebase'

Vue.config.productionTip = false
Vue.use(Vuelidate)

auth.onAuthStateChanged(user => {
  if(user){
    store.dispatch('session/login', user.uid).then(() => initVue())
  }else{
    store.dispatch('session/logout').then(() => initVue())
  }
})

let vue = null

function initVue(){
  if(!vue){
    new Vue({
      store,
      router,
      render: h => h(App),
    }).$mount('#app')
  }
}

