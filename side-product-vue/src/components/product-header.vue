<template>
  <div class="container">
    <div class="header">
      <button @click="logout">logout</button>
      <h1>ระบบจัดการสินค้า</h1>
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
  flex-direction: column;
}

.header {
  background-color: antiquewhite;
  width: 100vw;
  text-align: center;
  font-size: 3vh;
}
</style>
