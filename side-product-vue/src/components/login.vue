<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="login-container">
    <div class="login-header">
      <h1>Login</h1>
    </div>
    <div class="login-content">
      <form>
        <label for="username">username: </label>
        <input id="username" v-model="username"/>

        <label for="password">password: </label>
        <input id="password" type="password" v-model="password"/>
      </form>
    </div>
    <button type="submit">เข้าสู่ระบบ</button>
    <p>หรือ</p>
    <a class="register" @click="register">สมัครสมาชิก</a>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
export default {
  name:'loginForm',
  setup: () => {
    const username = ref<string>()
    const password = ref<string>()
    const router = useRouter();

    const register = () => {
      router.push('/registerForm')
    }
    return {
      username,
      password,
      register,
    }
  }
}
</script>

<style>
.login-container {
  background-color: aliceblue;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
}

.login-header {
  font-weight: bold;
  font-size: 30px;
}

.login-content {
  background-color: azure;
  border: 1px solid;
  padding: 2%;
  margin: 3%;
}

.register {
  text-decoration-line: underline;
  cursor: pointer;
}
</style>
