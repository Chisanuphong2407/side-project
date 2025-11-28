<template>
  <div class="add-product">
    <div class="addproduct-header">แก้ไขข้อมูล</div>
    <div v-if="product">
      <form @submit.prevent="submitProduct" class="add-product-form">
        <label for="product-name">ชื่อสินค้า</label>
        <input id="product-name" type="text" placeholder="ชื่อสินค้าของท่าน" v-model="product.productname" />

        <label for="product-description">รายละเอียดสินค้า</label>
        <input id="product-description" type="text" placeholder="ข้อมูลเกี่ยวกับสินค้าของท่าน"
          v-model="product.description" />

        <label for="product-quantity">จำนวนสินค้า</label>
        <input id="product-quantity" type="number" placeholder="จำนวนสินค้า" v-model="product.quantity" min="1" />

        <label for="product-unit">หน่วย</label>
        <select id="product-unit" v-model="product.unit">
          <option disabled value="" selected>--หน่วย--</option>
          <option v-for="u in allUnit" :key="u._id" :value="u._id">{{ u.unitname }}</option>
        </select>

        <label for="product-price">ราคา (บาท)</label>
        <input id="product-price" type="number" placeholder="ราคาสินค้า (บาท)" v-model="product.price" />

        <div class="img">
          <label for="product-image">รูปภาพ</label>
          <img v-if="previewPath" :src="previewPath" alt="Image Preview" class="image-preview" />

          <input id="product-image" type="file" ref="fileInput" @change="fileHandle" accept="image/*" />
        </div>

        <label for="product-unit">หมวดหมู่</label>
        <select id="product-unit" v-model="product.catalog">
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
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, toRaw, unref } from 'vue'
import { useUserUIDStore } from '@/stores/counter'
import { useRouter, useRoute } from 'vue-router'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import productService from '@/api/product-service'
import catalogService from '@/api/catalog-service'
import unitService from '@/api/unit-service'

// กำหนดชื่อ Component (Optional: จำเป็นถ้าใช้ KeepAlive หรืออยากเห็นชื่อใน DevTools)
defineOptions({
  name: 'editProduct'
})

const router = useRouter()
const route = useRoute();
const uidStore = useUserUIDStore();
const uid = <string>uidStore.currentUid;
const productID: string = <string>route.query.productID;
// State
const product = ref()

const isloading = ref<boolean>(false)
const allUnit = ref()
const allCatalog = ref()
const previewPath = ref<string | null>(null)

// File Refs
const fileInput = ref<HTMLInputElement | null>(null)
const selectFile = ref<File | null>(null)
const photoOBJ = ref()

onMounted(async () => {
  console.log(productID)
  try {
    const productData = await productService.getProduct(productID)
    product.value = productData.data;
    console.log(product.value)

    const catalogData = await catalogService.allCatalog(uid);
    allCatalog.value = catalogData.data;

    const unitData = await unitService.allUnit(uid);
    allUnit.value = unitData.data;

    console.log(productID);
    const userRef = doc(db, 'ProductPic', productID);

    const docSnap = await getDoc(userRef);


    if (docSnap.exists()) {
      // console.log("ข้อมูลที่ได้:", docSnap.data().path.base64);
      previewPath.value = docSnap.data().path.base64
      photoOBJ.value = {
        base64: previewPath.value,
        filename: docSnap.data().path.filename,
        fileType: docSnap.data().path.fileType,
        fileSize: docSnap.data().path.fileSize,
      }
    }
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

//แปลงไฟล์เป็น base64
const compressIMG = (file: File, quality = 0.7, maxWidth = 800): Promise<Blob> => {
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
  const input = event.target as HTMLInputElement
  // ต้องแน่ใจว่าใช้ .files[0]
  const file = input.files ? input.files[0] : null //ดึงไฟล์แรกที่ถูกเลือก

  if (file) {
    try {
      // 1. สั่งย่อรูปก่อน (เหลือความกว้าง 800px, คุณภาพ 70%)
      // ต่อให้รูปมา 10MB ก็จะเหลือแค่หลักร้อย KB
      const compressBlob = await compressIMG(file, 0.7, 800);
      console.log("ขนาดหลังย่อ:", compressBlob.size / 1024, "KB");

      // 2. แปลง Blob กลับเป็น File (เพื่อให้โค้ดส่วนอื่นทำงานต่อได้เหมือนเดิม)
      const compressFile = new File([compressBlob], file.name, {
        type: 'image/jpeg',
        lastModified: Date.now(),
      });

      // 3. ทำงานต่อตามปกติ แปลงไฟล์เป็น base64
      selectFile.value = compressFile;
      previewPath.value = await convertIMGtobase64(compressFile);

      photoOBJ.value = {
        base64: previewPath.value,
        fileSize: selectFile.value?.size,
        fileType: selectFile.value?.type,
        filename: selectFile.value?.name,
      }
      console.log('photo', photoOBJ)
    } catch (error) {
      console.log(error);
    }
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
    await productService.editProduct(productID, sendData)
    const imageRef = doc(db, "ProductPic", productID || '');

    console.log('photo', photoOBJ.value)
    await setDoc(imageRef, {
      productID: productID,
      path: photoOBJ.value,
    })
    isloading.value = false
    router.push('/');
    alert('อัพเดตสำเร็จ')
  } catch (error) {
    alert(error)
    isloading.value = false
  }
}
</script>

<style></style>
