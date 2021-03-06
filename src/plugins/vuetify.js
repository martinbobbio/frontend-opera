import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'
import es from 'vuetify/es5/locale/es'
import { Resize } from 'vuetify/lib/directives'

Vue.use(Vuetify, {
  theme: {
    primary: '#a21010',
    secondary: '#553f75',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107'
  },
  options: {
    customProperties: true
  },
  directives:{
    Resize
  },
  iconfont: 'md',
  lang: {
    locales: { es },
    current: 'es'
  },
})
