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

<script lang="ts">
import { onMounted, ref, unref, toRaw } from 'vue'
import { useProductIDStore } from '@/stores/counter'
import axios from 'axios'
import { useRouter } from 'vue-router'
export default {
  name: 'editProduct',
  setup: () => {
    const product = ref()
    const productStore = useProductIDStore()
    const isloading = ref<boolean>(false)
    const allUnit = ref()
    const allCatalog = ref()
    const previewPath = ref<string | null>(null)
    const productID = productStore.currentProductID
    const router = useRouter();

    onMounted(async () => {
      console.log(productID)
      try {
        const productData = await axios.get(`http://localhost:3000/product/${productID}`)
        console.log(productData.data)
        product.value = productData.data

        const unitData = await axios.get('http://localhost:3000/unit')
        allUnit.value = unitData.data

        const catalogData = await axios.get('http://localhost:3000/catalog')
        allCatalog.value = catalogData.data

        //+ http เพื่อให้ตาม path ได้
        previewPath.value = `http://localhost:3000${productData.data.image}`
      } catch (error) {
        alert('error')
        console.log(error)
      }
    })

    //เก็บ fileInput โดยตรง
    const fileInput = ref<HTMLInputElement | null>(null)

    //เก็บ OBJ file ที่เลือก
    const selectFile = ref<File | null>(null)

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

    const removeImage = () => {
      selectFile.value = null
      previewPath.value = null
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    }

    const submitProduct = async () => {
      isloading.value = true
      delete product.value._id
      const raw = unref(product)

      const sendData = toRaw(raw)
      console.log(sendData);
      try {
        await axios.patch(`http://localhost:3000/product/${productID}`, sendData)
        isloading.value = false
        router.push('/');
        alert('อัพเดตสำเร็จ')
      } catch (error) {
        alert(error)
      }
    }

    return {
      product,
      isloading,
      allUnit,
      allCatalog,
      fileInput,
      selectFile,
      fileHandle,
      previewPath,
      submitProduct,
    }
  },
}
</script>

<style>
</style>
