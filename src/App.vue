  <template>
    <div>
      <div class="container" v-if="isLogin">
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
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import { useUserNameStore, useUserUIDStore } from './stores/counter'

const router = useRouter()
const isLogin = ref<boolean>(false);
const userStore = useUserNameStore()
const userUidStore = useUserUIDStore()

onMounted(() => {
  onAuth();
})

const onAuth = () => {
  onAuthStateChanged(auth, (user) => {
    console.log('checking')
    console.log(user)
    if (user != undefined) {
      console.log('auth------------------')
      isLogin.value = true
      userStore.setUsername(<string>user.displayName)
      userUidStore.setUid(user.uid)
      // router.replace('/product');
    } else {
      console.log("else+++++++++++++++++++++")
      isLogin.value = false
      router.replace('/loginForm');
    }
  })
}

</script>

<style scoped>
.container {
  height: 100vh;
  max-width: 100vw;
  display: grid;
  grid-template-columns: 12vw 1fr;
  grid-template-rows: 15vh 1fr;
  grid-template-areas:
    'header header'
    'nav main';
    user-select: none;
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
