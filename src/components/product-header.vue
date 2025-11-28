<template>
  <div class="container">
    <div class="header">
      <h1 class="web-header" @click="resetPath">ระบบจัดการสินค้า</h1>
      <div class="right-element">
        <h3 class="username">{{ userStore.currentUsername }}</h3>
        <Icon icon="material-symbols:logout-rounded" width="4vh" height="4vh" @click="logout" class="logout-btn" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { signOut } from 'firebase/auth'
import { auth } from '@/firebase'
import { useUserNameStore } from '@/stores/useUserNameStore'
import { useUserUIDStore } from '@/stores/useUserUIDStore'
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'

const userStore = useUserNameStore();
const uidStore = useUserUIDStore();
const router = useRouter();

const logout = async() => {
  try {
    await signOut(auth).then(() => {
      console.log("logout!!!")
    })
    userStore.$reset();
    uidStore.$reset();
  } catch (error) {
    console.log('logout error', error)
  }
}

const resetPath = () => {
  router.push('/')
}


</script>

<style>
.container {
  display: flex;
  width: auto;
  background-color: antiquewhite;
}

.header {
  display: flex;
  flex-direction: row;
  width: 99vw;
  font-size: 3vh;
  justify-content: space-between;
  align-items: center;
}

.logout-btn {
  height: fit-content;
  width: 4vh;
  padding: 1vw;
  border-radius: 1vh;
  font-size: 16px;
  border-width: 0.5px;
  font-family: monospace;
  cursor: pointer;
}


.logout-btn:active {
  background-color: rgb(189, 189, 189);
}

.web-header {
  cursor: pointer;
  user-select: none;
  margin-left: 1vw;
  font-size: 5vh;
}

.right-element {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.username {
  font-size: 4vh;
}
</style>
