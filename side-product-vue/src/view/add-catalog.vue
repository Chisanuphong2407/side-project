<template>
  <div class="add-product">
    <div class="addproduct-header">เพิ่มหมวดหมู่และหน่วยสินค้า</div>
    <form @submit.prevent="submitCatalog" class="catalog-form">
      <div class="form-unit">
        <label for="catalog-name" class="catalog-label">ชื่อหมวดหมู่</label>
        <input id="catalog-name" type="text" placeholder="เพิ่มหมวดหมู่ของท่าน" v-model="catalog" />
      </div>

      <div class="form-unit">
        <label for="unit-name" class="catalog-label">หน่วยสินค้า</label>
        <input id="unit-name" type="text" placeholder="เพิ่มหน่วยสินค้าของท่าน" v-model="unit" />
      </div>

      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'กำลังบันทึก' : 'บันทึก' }}
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import axios from 'axios'
export default {
  name: 'addCatalog',
  setup: () => {
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
            await axios.post(`${URL}/unit`, {unitname: unit.value})
            await axios.post(`${URL}/catalog`,{catalogName: catalog.value})
            alert('บันทึกหมวดหมู่และหน่วยสำเร็จ')
            isLoading.value = false
          } else if (unit.value !== '') {
            // formUnit.append('unitname', unit.value)
            await axios.post(`${URL}/unit`, {unitname: unit.value})
            alert('เพิ่มหน่วยสำเร็จ')
            isLoading.value = false
          } else if (catalog.value != '') {
            await axios.post(`${URL}/catalog`,{catalogName: catalog.value})
            alert('เพิ่มหมวดหมู่สำเร็จ')
            isLoading.value = false
          }
        } catch (error) {
          alert('เพิ่มข้อมูลไม่สำเร็จ')
          console.log(error)
        }finally{
          //clear input
          unit.value = ''
          catalog.value = ''
        }
      } else {
        alert(' กรุณากรอกข้อมูล')
        isLoading.value = false
      }
    }

    return {
      catalog,
      unit,
      submitCatalog,
      isLoading,
    }
  },
}
</script>

<style>
.catalog-form {
  flex-direction: column;
  width: fit-content;
  justify-items: center;
}

.form-unit {
  display: flex;
  flex-direction: row;
}
</style>
