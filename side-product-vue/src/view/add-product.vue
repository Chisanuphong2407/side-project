<template>
  <div class="add-product">
    <div class="addproduct-header">เพิ่มสินค้าใหม่</div>
    <form @submit.prevent="submitProduct" class="add-product-form">
      <label for="product-name">ชื่อสินค้า</label>
      <input
        id="product-name"
        type="text"
        placeholder="ชื่อสินค้าของท่าน"
        v-model="product.productname"
        required
      />

      <label for="product-description">รายละเอียดสินค้า</label>
      <input
        id="product-description"
        type="text"
        placeholder="ข้อมูลเกี่ยวกับสินค้าของท่าน"
        v-model="product.description"
        required
      />

      <label for="product-quantity">จำนวนสินค้า</label>
      <input
        id="product-quantity"
        type="number"
        placeholder="จำนวนสินค้า"
        v-model="product.quantity"
        min="1"
        required
      />

      <label for="product-unit">หน่วย</label>
      <input
        id="product-unit"
        type="text"
        placeholder="เช่น ชิ้น ใบ ฯลฯ"
        v-model="product.unit"
        required
      />

      <label for="product-price">ราคา (บาท)</label>
      <input
        id="product-price"
        type="number"
        placeholder="ราคาสินค้า (บาท)"
        v-model="product.price"
        required
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
          required
        />
      </div>

      <label for="product-catalog">หมวดหมู่</label>
      <input
        id="product-catalog"
        type="text"
        placeholder="หมวดหมู่"
        v-model="product.catalog"
        required
      />
      <button type="submit" class="submit-button" :disabled="isloading">
        {{ isloading ? 'กำลังบันทึก' : 'บันทึก' }}
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import axios from 'axios'
import { ref } from 'vue'
export default {
  name: 'addProduct',
  setup: () => {
    //เก็บ path ชั่วคราว ภาพตัวอย่าง
    const previewPath = ref<string | null>(null)
    const isloading = ref<boolean>(false)
    const isSuccess = ref<boolean>(false)

    const product = ref({
      productname: '',
      description: '',
      quantity: 1,
      unit: '',
      price: 1,
      image: '',
      catalog: '',
      ownerID: '123456789012348576849587',
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

      if (!selectFile.value) {
        alert('กรุณาเลือกรูปภาพสินค้า!')
        isloading.value = false
        return
      }
      try {
        // สร้าง FormData Object สำหรับส่งทั้งข้อมูลและไฟล์
        const formData = new FormData();

        formData.append('productname', product.value.productname)
        formData.append('description', product.value.description)
        formData.append('quantity', product.value.quantity.toString())
        formData.append('unit', product.value.unit)
        formData.append('price', product.value.price.toString())
        formData.append('image', selectFile.value);

        formData.append('catalog', product.value.catalog)
        formData.append('ownerID', product.value.ownerID)

        // ส่งคำขอ POST โดยระบุ Header 'Content-Type': 'multipart/form-data'
        //    (Axios จะจัดการให้เองถ้าเป็น FormData)
        const response = await axios.post('http://localhost:3000/product', formData );
        alert('บันทึกสินค้าสำเร็จ!');

        removeImage()
        product.value = {
          productname: '',
          description: '',
          quantity: 0,
          unit: '',
          price: 0,
          image: '',
          catalog: '',
          ownerID: '123456789012348576849587',
        }
        isSuccess.value = true
      } catch (error) {
        console.log(error)
      } finally {
        isloading.value = false
      }
    }

    return {
      product,
      submitProduct,
      isloading,
      fileHandle,
      fileInput,
      previewPath,
    }
  },
}
</script>

<style>
.add-product {
  display: flex;
  flex-direction: column;
  background-color: aliceblue;
  align-content: center;
  align-items: center;
}

form {
  display: flex;
  flex-direction: column;
  width: 30vw;
}

label {
  font-weight: bold;
  margin: 10px;
}

input {
  height: 30px;
  padding-inline: 10px;
}

.submit-button {
  margin-block: 15px;
  padding-block: 0.5vh;
  padding-inline: 1vh;
  width: fit-content;
}

.addproduct-header {
  text-align: center;
  font-size: 5vh;
  padding: 1vw;
}

.image-preview {
  max-block-size: 20vh;
  object-fit: contain;
  margin: 1vh;
}

.img {
  display: flex;
  flex-direction: column;
}
</style>