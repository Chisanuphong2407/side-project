<template>
  <div class="add-product">
    <div class="addproduct-header">เพิ่มสินค้าใหม่</div>
    <form @submit.prevent="submitProduct" class="add-product-form">
      <label for="product-name">ชื่อสินค้า</label>
      <input id="product-name" type="text" placeholder="ชื่อสินค้าของท่าน" v-model="product.productname" required />

      <label for="product-description">รายละเอียดสินค้า</label>
      <input id="product-description" type="text" placeholder="ข้อมูลเกี่ยวกับสินค้าของท่าน"
        v-model="product.description" required />

      <label for="product-quantity">จำนวนสินค้า</label>
      <input id="product-quantity" type="number" placeholder="จำนวนสินค้า" v-model="product.quantity" min="1"
        required />

      <label for="product-unit">หน่วย</label>
      <select id="product-unit" v-model="product.unit" @change="Unitlog(product.unit)" required>
        <option disabled value="" selected>--หน่วย--</option>
        <option v-for="u in allUnit" :key="u._id" :value="u._id">{{ u.unitname }}</option>
      </select>

      <label for="product-price">ราคา (บาท)</label>
      <input id="product-price" type="number" placeholder="ราคาสินค้า (บาท)" v-model="product.price" required />

      <div class="img">
        <label for="product-image">รูปภาพ</label>
        <img v-if="previewPath" :src="previewPath" alt="Image Preview" class="image-preview" />

        <input id="product-image" type="file" ref="fileInput" @change="fileHandle" accept="image/*" required />
      </div>

      <label for="product-unit">หมวดหมู่</label>
      <select id="product-unit" v-model="product.catalog" required>
        <option disabled value="" selected>--หมวดหมู่--</option>
        <option v-for="c in allCatalog" :key="c._id" :value="c._id">{{ c.catalogName }}</option>
      </select>
      <div class="button-zone">
        <button type="submit" class="submit-button" :disabled="isloading">
          {{ isloading ? 'กำลังบันทึก' : 'บันทึก' }}
        </button>
        <button type="reset" class="reset-button">รีเซ็ตข้อมูล</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import axios from 'axios'
import { onMounted } from 'vue'
import { db } from '@/firebase'
import { doc, setDoc } from 'firebase/firestore'
import { useUserUIDStore } from '@/stores/counter'

defineOptions({
  name: 'addProduct',
})
//เก็บ path ชั่วคราว ภาพตัวอย่าง
const previewPath = ref<string>('')
const isloading = ref<boolean>(false)
const isSuccess = ref<boolean>(false)
const BASE_URL = import.meta.env.VITE_API_BASE_URL

const uidStore = useUserUIDStore();
const uid = <string>uidStore.currentUid;

const allUnit = ref()
const allCatalog = ref()
const product = ref({
  productname: '',
  description: '',
  quantity: 1,
  unit: '',
  price: 1,
  image: '',
  catalog: '',
  ownerID: '',
})

onMounted(async () => {
  try {
    const unitData = await axios.get(`${BASE_URL}/unit`)
    allUnit.value = unitData.data
    console.log(allUnit.value);

    const catalogData = await axios.get(`${BASE_URL}/catalog`)
    allCatalog.value = catalogData.data

    product.value.ownerID = uid

    console.log(product.value.ownerID);
  } catch (error) {
    console.log(error)
  }
})

//เก็บ fileInput โดยตรง
const fileInput = ref<HTMLInputElement | null>(null)

//เก็บ OBJ file ที่เลือก
const selectFile = ref<File | null>(null)


//แปลงไฟล์เป็น base64
const compressIMG = (file: File, quality = 0.5, maxWidth = 800): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader(); //สร้างตัวอ่านไฟล์
    reader.readAsDataURL(file); // อ่านไฟล์
    reader.onload = (event) => {
      const img = new Image();
      //สร้าง canvas เพื่อวาดรูปขึ้นใหม่
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width;
        let height = img.height;

        //คำนวณขนาดใหม่
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth
        }
        canvas.width = width
        canvas.height = height

        //วาดรูปลง canvas
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        //แปลงเป็น blob พร้อมลดคุณภาพ
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error("compression failed"));
        }, 'image/jpeg', quality); // quality 0.7 คือชัด 70% (ขนาดลดลงเยอะมาก)
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err)
  })
}

//convert IMG
const convertIMGtobase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result as string);

    reader.onerror = (err) => reject(err);
  })
}

//@change activate
const fileHandle = async (event: Event) => {
  // ดึง Event.target มาเป็น HTMLInputElement เพื่อช่วย TypeScript
  const target = event.target as HTMLInputElement
  // ต้องแน่ใจว่าใช้ .files[0]
  const file = target.files?.[0]; //ดึงไฟล์แรกที่ถูกเลือก

  if (file) {
    try {
      // 1. สั่งย่อรูปก่อน (เหลือความกว้าง 800px, คุณภาพ 70%)
      // ต่อให้รูปมา 10MB ก็จะเหลือแค่หลักร้อย KB
      const compressBlob = await compressIMG(file, 0.5, 800);
      console.log("ขนาดหลังย่อ:", compressBlob.size / 1024, "KB");

      // 2. แปลง Blob กลับเป็น File (เพื่อให้โค้ดส่วนอื่นทำงานต่อได้เหมือนเดิม)
      const compressFile = new File([compressBlob], file.name, {
        type: 'image/jpeg',
        lastModified: Date.now(),
      });

      // 3. ทำงานต่อตามปกติ แปลงไฟล์เป็น base64
      selectFile.value = compressFile;
      previewPath.value = await convertIMGtobase64(selectFile.value);

    } catch (error) {
      alert("convert error")
      console.log(error);
    }
  } else {
    removeImage()
  }
}

const removeImage = () => {
  selectFile.value = null
  previewPath.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const Unitlog = (unit: string) => {
  // const index = allUnit.value.indexOf(unit);
  // console.log(index)
  console.log(unit)
  // console.log(allUnit.value[index]._id)
}

const submitProduct = async () => {
  isloading.value = true

  const photoOBJ = {
    filename: selectFile.value?.name,
    fileType: selectFile.value?.type,
    fileSize: selectFile.value?.size,
    base64: previewPath.value,
  }

  if (!selectFile.value) {
    alert('กรุณาเลือกรูปภาพสินค้า!')
    isloading.value = false
    return
  }
  try {
    // ส่งคำขอ POST โดยระบุ Header 'Content-Type': 'multipart/form-data'
    //    (Axios จะจัดการให้เองถ้าเป็น FormData)
    const result = await axios.post(`${BASE_URL}/product`, {
      productname: product.value.productname,
      description: product.value.description,
      quantity: product.value.quantity,
      unit: product.value.unit,
      price: product.value.price,
      catalog: product.value.catalog,
      ownerID: product.value.ownerID,
    })
    alert('บันทึกสินค้าสำเร็จ!')

    removeImage()
    product.value = {
      productname: '',
      description: '',
      quantity: 1,
      unit: '',
      price: 1,
      image: '',
      catalog: '',
      ownerID: uid,
    }
    const productID = result.data._id
    const userRef = doc(db, 'ProductPic', productID);

    await setDoc(userRef, {
      productID: productID,
      path: photoOBJ,
    })
    isSuccess.value = true
  } catch (error) {
    console.log(error)
    alert('เพิ่มข้อมูลไม่สำเร็จ');
  } finally {
    isloading.value = false
  }
}
</script>

<style>
.add-product {
  display: flex;
  flex-direction: column;
  /* background-color: aliceblue; */
  align-content: center;
  align-items: center;
  border: 1px solid black;
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

.button-zone {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.submit-button {
  margin-block: 15px;
  padding-block: 1vh;
  padding-inline: 1vw;
  width: fit-content;
  background-color: rgb(215, 216, 216);
  box-shadow: 2px 2px 3px gray;
  cursor: pointer;
  border-width: 0px;
  border-radius: 1vw;
}

.submit-button:active {
  transform: translateY(4px);
}

.reset-button {
  margin-block: 15px;
  padding-block: 1vh;
  padding-inline: 1vw;
  width: fit-content;
  background-color: rgb(215, 216, 216);
  box-shadow: 2px 2px 3px gray;
  cursor: pointer;
  border-width: 0px;
  border-radius: 1vw;
  transition: all 0.3s ;
}

.reset-button:hover {
  background-color: rgb(237, 66, 66);
  color: white;
}

.reset-button:active {
  background-color: rgb(156, 3, 3);
  color: white;
}

.addproduct-header {
  text-align: center;
  font-size: 5vh;
  font-family: sans-serif;
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

select {
  padding: 0.5vw;
}
</style>
