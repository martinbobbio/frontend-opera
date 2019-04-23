<template>
  <v-navigation-drawer v-model="menu.status" app temporary>
    <v-list>
      <v-list-tile :to="{ path: '/' }">
        <v-list-tile-action>
          <v-icon>home</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title v-text="'Inicio'"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile v-if="user" :to="{ name: 'profile', params: { username: user.username } }">
        <v-list-tile-action>
          <v-icon>account_circle</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title v-text="'Perfil'"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile v-if="!user" :to="{ name: 'login' }">
        <v-list-tile-action>
          <v-icon>arrow_forward</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title v-text="'Ingresar'"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile v-if="user" @click="removeSession">
        <v-list-tile-action>
          <v-icon>arrow_back</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title v-text="'Salir'"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>


<script>
import { mapActions } from "vuex";

export default {
  props: ["menu", "user"],
  methods: {
    ...mapActions("session", ["exit"]),
    removeSession() {
      this.exit();
      this.$router.push({ name: "login" });
    }
  }
};
</script>
