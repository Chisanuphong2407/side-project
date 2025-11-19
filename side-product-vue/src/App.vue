<template>
  <div class="container">
    <div v-if="false">
      <productHeader class="header" />
      <navigator class="nav" />
      <content class="content" />
    </div>
    <div v-else>
      <login />
    </div>
  </div>
</template>

<script lang="ts" setup>
import productHeader from './components/product-header.vue'
import content from './components/content.vue'
import navigator from './components/navigator.vue'
import login from './components/login.vue'
</script>

<style scoped>
.container {
  height: 100vh;
  max-width: 100vw;
  display: grid;
  grid-template-columns: 10vw 1fr;
  grid-template-rows: 15vh 1fr;
  grid-template-areas:
    'header header'
    'nav main';
}

.header {
  grid-area: header;
}

.content {
  grid-area: main;
}

.nav {
  grid: nav;
}
</style>
