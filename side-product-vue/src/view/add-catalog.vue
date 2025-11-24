<template>
  <div class="add-product">
    <div class="addproduct-header">เพิ่มหมวดหมู่และหน่วยสินค้า</div>
    <form @submit.prevent="submitCatalog" class="catalog-form">
      <div class="catalog-card">
        <div class="form-unit">
          <label for="catalog-name" class="catalog-label">ชื่อหมวดหมู่</label>
          <input id="catalog-name" type="text" placeholder="เพิ่มหมวดหมู่ของท่าน" v-model="catalog" />
        </div>

        <div class="form-unit">
          <label for="unit-name" class="catalog-label">หน่วยสินค้า</label>
          <input id="unit-name" type="text" placeholder="เพิ่มหน่วยสินค้าของท่าน" v-model="unit" />
        </div>

        <button type="submit" :disabled="isLoading" class="add-catalog">
          {{ isLoading ? 'กำลังบันทึก' : 'บันทึก' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import axios from 'axios'

defineOptions({
  name: 'addCatalog',
})
const catalog = ref<string>('')
const unit = ref<string>('')
const isLoading = ref(false)
const URL = import.meta.env.VITE_API_BASE_URL

const submitCatalog = async () => {
  const isEmpty = catalog.value.trim() == '' && unit.value.trim() == ''
  if (!isEmpty) {
    isLoading.value = true
    try {
      if (unit.value != '' && catalog.value != '') {
        await axios.post(`${URL}/unit`, { unitname: unit.value })
        await axios.post(`${URL}/catalog`, { catalogName: catalog.value })
        alert('บันทึกหมวดหมู่และหน่วยสำเร็จ')
        isLoading.value = false
      } else if (unit.value !== '') {
        // formUnit.append('unitname', unit.value)
        await axios.post(`${URL}/unit`, { unitname: unit.value })
        alert('เพิ่มหน่วยสำเร็จ')
        isLoading.value = false
      } else if (catalog.value != '') {
        await axios.post(`${URL}/catalog`, { catalogName: catalog.value })
        alert('เพิ่มหมวดหมู่สำเร็จ')
        isLoading.value = false
      }
    } catch (error) {
      alert('เพิ่มข้อมูลไม่สำเร็จ')
      console.log(error)
    } finally {
      //clear input
      unit.value = ''
      catalog.value = ''
    }
  } else {
    alert(' กรุณากรอกข้อมูล')
    isLoading.value = false
  }
}
</script>

<style>
.catalog-form {
  display: flex;
  justify-content: center;
  height: 70vh;
  align-self: center;
}

.catalog-card {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-unit {
  display: flex;
  flex-direction: row;
  margin-block: 80px;
  margin-block: 3vh;
}

.add-catalog {
  padding-inline: 2vw;
  padding-block: 1vh;
  width: fit-content;
  align-self: center;
  border-radius: 20px;
  font-size: large;
  border-width: 0px;
  background-color: rgb(215, 216, 216);
  box-shadow: 2px 2px 3px gray;
  cursor: pointer;
}

.add-catalog:active {
  background-color: rgb(179, 181, 181);
  color: aliceblue;
}
</style>
