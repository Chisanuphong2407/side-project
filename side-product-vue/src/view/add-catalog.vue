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
export default {
  name: 'Catalog',
  setup: () => {
    const catalog = ref<string>('')
    const unit = ref<string>('')
    const isLoading = ref(false)

    const submitCatalog = () => {
        const isEmpty = (catalog.value.trim() == '') && (unit.value.trim() == '') ;
      if (!isEmpty) {
        isLoading.value = true
        try {
        } catch (error) {}
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