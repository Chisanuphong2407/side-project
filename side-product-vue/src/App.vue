  <template>
  <div>
    <div class="container" v-if="login">
      <productHeader class="header" />
      <navigator class="nav" />
      <content class="content" />
    </div>
    <div v-else>
      <content />
    </div>
  </div>
</template>

  <script lang="ts" setup>
import productHeader from './components/product-header.vue'
import content from './components/content.vue'
import navigator from './components/navigator.vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const login = ref<boolean>(true)

onMounted(() => {
  if (login.value == false) {
    router.replace('/loginForm');
  }
})
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
