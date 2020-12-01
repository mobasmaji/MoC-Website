<template>
  <v-app>
    <v-app-bar app dense>
    <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    <!-- -->
    </v-app-bar>
  <!-- Sizes your content based upon application components -->
  <v-main>
    <!-- Provides the application the proper gutter -->
      <!-- If using vue-router -->
      <router-view></router-view>
  </v-main>

  <v-footer  app>
    <!-- -->
  </v-footer>
</v-app>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'App',

  data: () => ({
    //
    drawer: false,
    items: [
          { title: 'Map', icon: 'mdi-image', url: "/" },
          { title: 'About', icon: 'mdi-help-box', url: "/About" },
        ],
  }),
});
</script>
