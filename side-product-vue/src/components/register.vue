<template>
  <div class="register-container">
    <div class="register-header">
      <h1>Register</h1>
    </div>
    <div class="register-content">
      <form @submit.prevent="onSubmitRegister">
        <label for="firstname">ชื่อ: </label>
        <input id="firstname" v-model="firstname" />

        <label for="lastname">นามสกุล: </label>
        <input id="lastname" v-model="lastname" />

        <label for="email">email: </label>
        <input id="email" v-model="email" />

        <label for="phone">โทรศัพท์: </label>
        <input id="phone" v-model="phone" />

        <label for="username">username: </label>
        <input id="username" v-model="username" />

        <label for="password">รหัสผ่าน: </label>
        <input id="password" type="password" v-model="password" />

        <label for="confirmPassword">ยืนยันรหัสผ่าน: </label>
        <input id="confirmPassword" type="password" v-model="confirmPassword" />
        <button type="submit">สมัครสมาชิก</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'

export default {
  name: 'registerForm',
  setup: () => {
    const firstname = ref<string>()
    const lastname = ref<string>()
    const email = ref<string>()
    const phone = ref<string>()
    const username = ref<string>()
    const password = ref<string>()
    const confirmPassword = ref<string>()

    const onSubmitRegister = () => {
      const data = [
        firstname.value,
        lastname.value,
        email.value,
        phone.value,
        username.value,
        password.value,
      ]

      const topic: string[] = ['firstname', 'lastname', 'email', 'phone', 'username', 'password']
      const registerForm = new FormData()

      data.forEach((data, index) => {
        const key = (topic[index] || '').toString()
        const value = (data || '').toString();
        registerForm.append(key, value);

        console.log(registerForm.get(key));
      })
    }
    return {
      firstname,
      lastname,
      email,
      phone,
      username,
      password,
      confirmPassword,
      onSubmitRegister,
    }
  },
}
</script>

<style>
.register-container {
  background-color: aliceblue;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
}

.register-header {
  font-weight: bold;
  font-size: 30px;
}

.register-content {
  background-color: azure;
  border: 1px solid;
  padding: 2%;
  margin: 3%;
}
</style>
