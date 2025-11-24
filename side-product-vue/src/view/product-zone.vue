<template>
  <div class="product-list">
    <!-- แสดงรายการ product -->
    <div v-if="product.length > 0" class="product-container">
      <div v-for="p in product" :key="p._id" class="allProduct">
        <product-list v-if="product" :info="p" :selected-item="selectItem" @selected="selectedItem(p._id)" @edit="editProduct" @delete="deleteProduct"  class="product-list"/>
      </div>
    </div>
    <div v-else class="empty">
      <p class="empty-text">ไม่มีรายการสินค้าในขณะนี้</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useProductIDStore, useUserUIDStore } from '../stores/counter'
import { useRouter } from 'vue-router'
import productList from './product-list.vue'
import { doc, deleteDoc } from 'firebase/firestore'
import { db } from '@/firebase'
// import { doc,getDoc } from 'firebase/firestore'
// import { db } from '@/firebase'

defineOptions({
  name: 'productZone',
})

interface Product {
  _id: string;
  productname: string;
  description: string;
  quantity: number;
  unit: string;
  price: string;
  catalog: string;
  ownerID: string;
}

const URL = import.meta.env.VITE_API_BASE_URL
const product = ref<Product[]>([])
const productStore = useProductIDStore()
const userStore = useUserUIDStore();
const uid = userStore.currentUid
const router = useRouter()

onMounted(() => {
  fetchProduct()
  // fetchUser()
})

const fetchProduct = async () => {
  try {
    //fetch product ทั้งหมดออกมา
    console.log('url', URL)
    const productfetch = await axios.get(`${URL}/product/all/${uid}`)
    console.log(productfetch)

    product.value = productfetch.data

  } catch (error) {
    console.log(error)
  }
}

// const fetchUser = async() => {
//   const userData = await axios.get(`${URL}/user/${uid}`)
//   const userResult = userData.data.username
//   console.log('user',userResult);
// }
const selectItem = ref<string>()

const selectedItem = (product: string) => {
  if (selectItem?.value && selectItem.value === product) {
    selectItem.value = '' // ปิดรายละเอียด
  } else {
    selectItem.value = product // เปิดรายละเอียด
  }
}

const editProduct = (product: string) => {
  productStore.setProductID(product)
  router.push('/editProduct')
}

const deleteProduct = async (product: string) => {
  try {
    await axios.delete(`${URL}/product/${product}`);

    await deleteDoc(doc(db, "ProductPic", product))
    fetchProduct();
  } catch (error) {
    console.log(error);
    alert('ลบไม่สำเร็จ');
  }
}
</script>

<style scoped>
.product-list {
  display: flex;
  flex-direction: column;
  /* background-color: rgb(211, 230, 233); */
}

.product-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  grid-auto-flow: dense;
  overflow-x: auto;
  overflow-y: auto;
  gap: 10px;
  margin: 1vw;
  /* width: fit-content; */
  max-height: 100%;
}

.empty {
  display: grid;
  place-items: center;
  height: 85vh;
}

.empty-text {
  font-size: 30px;
  opacity: 0.5;
}

.allProduct {
  display: flex;
  flex-direction: column;
  /* background-color: rgb(166, 162, 162); */
  /* border: 1px solid black; */
}

.name {
  margin: 3px;
}

</style>
