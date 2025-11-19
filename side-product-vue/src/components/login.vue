<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="login-container">
    <div class="login-header">
      <h1>Login</h1>
    </div>
    <div class="login-content">
      <form>
        <label for="username">username: </label>
        <input id="username"/>

        <label for="password">password: </label>
        <input id="password" type="password" />
      </form>
    </div>
    <button type="submit">เข้าสู่ระบบ</button>
    <p>หรือ</p>
    <a class="register">สมัครสมาชิก</a>
  </div>
</template>

<script lang="ts">
export default {}
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
