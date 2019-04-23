<template>
  <v-app>
    <menuaux :menu="menu" :user="user"/>
    <v-toolbar color="primary" dark app>
      <v-toolbar-side-icon @click="menu.status = !menu.status"></v-toolbar-side-icon>
      <v-toolbar-title class="headline ff-primary pointer" @click="$router.push({ name: 'home'})">
        <span>{{title}}</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <router-link v-if="user" class="name" :to="{name:'profile', params: { username: user.username }}">
        <span>{{user.firstname}}</span>
      </router-link>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-slide-y-transition mode="out-in">
          <router-view></router-view>
        </v-slide-y-transition>
      </v-container>
    </v-content>
    <modalLoading :options="checkAuth"/>
    <notifications :notification="notification" :onClose="hideNotification"/>
    <footeraux/>
  </v-app>
</template>


<script>
import Menu from "@/components/Menu"
import Footer from "@/components/Footer"
import ModalLoading from "@/components/ModalLoading"
import Notifications from "@/components/Notifications"

import { mapState, mapMutations } from 'vuex'

export default {
  name: "App",
  components: { menuaux:Menu, footeraux:Footer, ModalLoading, Notifications },
  data() {
    return {
      title: "Súper Ópera",
      menu: { status:false }
    }
  },
  methods:{
    ...mapMutations(['hideNotification']),
  },
  computed: {
    ...mapState(['notification', 'checkAuth']),
    ...mapState('session', ['user'])
  }
};
</script>


<style>
@import url("https://fonts.googleapis.com/css?family=Great+Vibes");

.ff-primary{
  font-family: 'Great Vibes', cursive !important;
}
.pointer{
  cursor: pointer;
}
.name{
  color:white;
  text-decoration: none;
  font-size: 1.2rem;
}
</style>

