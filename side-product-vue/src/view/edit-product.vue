<template>
  <div class="add-product">
    <div class="addproduct-header">แก้ไขข้อมูล</div>
    <div v-if="product">
      <form @submit.prevent="submitProduct" class="add-product-form">
        <label for="product-name">ชื่อสินค้า</label>
        <input
          id="product-name"
          type="text"
          placeholder="ชื่อสินค้าของท่าน"
          v-model="product.productname"
        />

        <label for="product-description">รายละเอียดสินค้า</label>
        <input
          id="product-description"
          type="text"
          placeholder="ข้อมูลเกี่ยวกับสินค้าของท่าน"
          v-model="product.description"
        />

        <label for="product-quantity">จำนวนสินค้า</label>
        <input
          id="product-quantity"
          type="number"
          placeholder="จำนวนสินค้า"
          v-model="product.quantity"
          min="1"
        />

        <label for="product-unit">หน่วย</label>
        <select id="product-unit" v-model="product.unit">
          <option disabled value="" selected>--หน่วย--</option>
          <option v-for="u in allUnit" :key="u._id">{{ u.unitname }}</option>
        </select>

        <label for="product-price">ราคา (บาท)</label>
        <input
          id="product-price"
          type="number"
          placeholder="ราคาสินค้า (บาท)"
          v-model="product.price"
        />

        <div class="img">
          <label for="product-image">รูปภาพ</label>
          <img v-if="previewPath" :src="previewPath" alt="Image Preview" class="image-preview" />

          <input
            id="product-image"
            type="file"
            ref="fileInput"
            @change="fileHandle"
            accept="image/*"
          />
        </div>

        <label for="product-unit">หมวดหมู่</label>
        <select id="product-unit" v-model="product.catalog">
          <option disabled value="" selected>--หมวดหมู่--</option>
          <option v-for="c in allCatalog" :key="c._id">{{ c.catalogName }}</option>
        </select>
        <button type="submit" class="submit-button" :disabled="isloading">
          {{ isloading ? 'กำลังบันทึก' : 'บันทึก' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, toRaw, unref } from 'vue'
import { useProductIDStore } from '@/stores/counter'
import axios from 'axios'
import { useRouter } from 'vue-router'

// กำหนดชื่อ Component (Optional: จำเป็นถ้าใช้ KeepAlive หรืออยากเห็นชื่อใน DevTools)
defineOptions({
  name: 'editProduct'
})

const productStore = useProductIDStore()
const router = useRouter()
const productID = productStore.currentProductID

// State
const product = ref()
const isloading = ref<boolean>(false)
const allUnit = ref()
const allCatalog = ref()
const previewPath = ref<string | null>(null)

// File Refs
const fileInput = ref<HTMLInputElement | null>(null)
const selectFile = ref<File | null>(null)

onMounted(async () => {
  console.log(productID)
  try {
    const productData = await axios.get(`${URL}/product/${productID}`)
    console.log(productData.data)
    product.value = productData.data

    const unitData = await axios.get(`${URL}/unit`)
    allUnit.value = unitData.data

    const catalogData = await axios.get(`${URL}/catalog`)
    allCatalog.value = catalogData.data

    //+ http เพื่อให้ตาม path ได้
    previewPath.value = `${URL}${productData.data.image}`
  } catch (error) {
    alert('error')
    console.log(error)
  }
})

const removeImage = () => {
  selectFile.value = null
  previewPath.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

//@change activate
const fileHandle = (event: Event) => {
  // ดึง Event.target มาเป็น HTMLInputElement เพื่อช่วย TypeScript
  const input = event.target as HTMLInputElement
  // ต้องแน่ใจว่าใช้ .files[0]
  const file = input.files ? input.files[0] : null //ดึงไฟล์แรกที่ถูกเลือก

  if (file) {
    selectFile.value = file
    previewPath.value = URL.createObjectURL(file)
    console.log(selectFile)
  } else {
    removeImage()
  }
}

const submitProduct = async () => {
  isloading.value = true
  // Note: การลบ property ออกจาก ref โดยตรง
  if (product.value && product.value._id) {
     delete product.value._id
  }

  const raw = unref(product)
  const sendData = toRaw(raw)
  console.log(sendData);

  try {
    await axios.patch(`${URL}/product/${productID}`, sendData)
    isloading.value = false
    router.push('/');
    alert('อัพเดตสำเร็จ')
  } catch (error) {
    alert(error)
    isloading.value = false // ควรปิด loading กรณี error ด้วย
  }
}
</script>

<style>
</style>
