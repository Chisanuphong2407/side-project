<template>
  <div class="container">
    <div class="header">
      <h1>ระบบจัดการสินค้า</h1>
      <button @click="logout" class="logout-btn">logout</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { signOut } from 'firebase/auth'
import { auth } from '@/firebase'
import { useUserNameStore } from '@/stores/counter'

const userStore = useUserNameStore();

const logout = () => {
  try {
    signOut(auth).then(() => {
      console.log("logout!!!")
    })
    userStore.setUsername('')
  } catch (error) {
    console.log('logout error', error)
  }
}
</script>

<style>
.container {
  display: flex;
}

.header {
  display: flex;
  flex-direction: row;
  background-color: antiquewhite;
  width: 97vw;
  font-size: 3vh;
  padding-inline: 1vw;
  justify-content: space-between;
  align-items: center;
}

.logout-btn {
  height: fit-content;
  width: fit-content;
  padding: 1vw;
  border-radius: 1vh;
  font-size: 16px;
  border-width: 0.5px;
  font-family: monospace;
}

.logout-btn:active {
  background-color: rgb(189, 189, 189);
}
</style>
