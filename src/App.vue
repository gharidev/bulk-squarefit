<template>
  <v-app>
    <v-main>
      <HomeView />
    </v-main>
    <v-footer padless class="justify-center">
          <p class="text-center pa-4 ma-0">Crafted with ❤ by Haridev<br />
            Links: <a href="https://github.com/gharidev" target="_blank">Github</a> | <a href="https://haridev.me" target="_blank">Portfolio</a></p>
    </v-footer>
  </v-app>
</template>

<script>
import HomeView from './views/HomeView.vue';

export default {
  name: 'App',

  components: {
    HomeView,
  },

  data: () => ({
  }),
};
</script>
