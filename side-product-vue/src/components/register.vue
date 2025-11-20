<template>
  <div class="register-container">
    <div class="register-header">
      <h1>Register</h1>
    </div>
    <div class="register-content">
      <form @submit.prevent="onSubmitRegister(email ?? '', password ?? '')">
        <label for="firstname">ชื่อ: </label>
        <input id="firstname" v-model="firstname" required />

        <label for="lastname">นามสกุล: </label>
        <input id="lastname" v-model="lastname" required />

        <label for="email">email: </label>
        <input id="email" v-model="email" required />

        <label for="phone">โทรศัพท์: </label>
        <input id="phone" v-model="phone" required />

        <label for="username">username: </label>
        <input id="username" v-model="username" required />

        <label for="password">รหัสผ่าน: </label>
        <input id="password" type="password" v-model="password" required />

        <label for="confirmPassword">ยืนยันรหัสผ่าน: </label>
        <input id="confirmPassword" type="password" v-model="confirmPassword" required />
        <button type="submit">สมัครสมาชิก</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { createUserWithEmailAndPassword ,updateProfile} from "firebase/auth";
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/firebase/index'
import axios from 'axios';

defineOptions({
  name: 'registerForm',
})
const firstname = ref<string>()
const lastname = ref<string>()
const email = ref<string>()
const phone = ref<string>()
const username = ref<string>()
const password = ref<string>()
const confirmPassword = ref<string>()
const URL = import.meta.env.VITE_API_BASE_URL;

const onSubmitRegister = async (email: string, password: string) => {
  // const data = [
  //   firstname.value,
  //   lastname.value,
  //   email.value,
  //   phone.value,
  //   username.value,
  //   password.value,
  // ]

  // const topic: string[] = ['firstname', 'lastname', 'email', 'phone', 'username', 'password']
  // const registerForm = new FormData()

  // data.forEach((data, index) => {
  //   const key = (topic[index] || '').toString()
  //   const value = (data || '').toString();
  //   registerForm.append(key, value);

  //   console.log(registerForm.get(key));
  // })

  if (password !== confirmPassword.value) {
    alert("ยืนยันรหัสผ่านไม่สำเร็จ");
    return false;
  }

  try {
    console.log(auth)
    //1. สร้าง account ใน firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);

    //userCredential กลายเป็น OBJ
    //เก็บข้อมูลทั้งหมดของ account ที่พึ่งสร้าง
    const user = userCredential.user;
    //user เก็บ uid ไว้
    const uid = user.uid;

    //2. เก็บข้อมูล user เข้า db
    //doc(database,ชื่อ collection,ชื่อ doc)
    //ไปที่ Database (db) -> คอลเลกชัน "users" -> สร้างเอกสารชื่อ "myUid"
    const userRef = doc(db, "User", uid);

    // คำสั่ง setDoc() คือการเขียนข้อมูลลงไปในตำแหน่งที่ระบุไว้
    await setDoc(userRef, {
      uid: uid,              // เก็บ uid ไว้อีกทีเพื่อความชัวร์
      email: email,
      username: username.value,
      firstName: firstname.value,
      lastName: lastname.value,
      phone: phone.value,
      createdAt: new Date()    // เก็บเวลาที่สมัคร
    });

    await axios.post(`${URL}/user`, {
      uid: uid,
      username: username.value
    })
    console.log("สำเร็จ! สร้าง User พร้อมเก็บข้อมูลเรียบร้อย");
  } catch (error) {
    alert("สมัครไม่สำเร็จ")
    console.log(error);
  }


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
