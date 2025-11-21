<template>
  <div class="product-list">
    <!-- แสดงรายการ product -->
    <div v-if="product.length > 0">
      <div v-for="p in product" :key="p._id" class="allProduct">
        <product-list v-if="product" :info="p" :selected-item="selectItem" @selected="selectedItem(p._id)" />
        <div class="button-zone">
          <button class="edit-button" @click="editProduct(p._id)">แก้ไข</button>
          <button class="delete-button" @click="deleteProduct(p._id)">ลบสินค้า</button>
        </div>
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
import { useProductIDStore } from '../stores/counter'
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
const router = useRouter()

onMounted(() => {
  fetchProduct()
})

const fetchProduct = async () => {
  try {
    //fetch product ทั้งหมดออกมา
    console.log('url', URL)
    const productfetch = await axios.get(`${URL}/product`)
    // console.log(productfetch)

    product.value = productfetch.data

  } catch (error) {
    console.log(error)
  }
}

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
  background-color: rgb(211, 233, 220);
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
  background-color: rgb(166, 162, 162);
  border: 1px solid black;
}

.productDetails {
  display: flex;
  flex-direction: column;
  background-color: rgb(192, 148, 148);
}

.name {
  margin: 3px;
}

.edit-button {
  margin: 5px;
  width: fit-content;
  padding-block: 3px;
}

.delete-button {
  margin: 5px;
  width: fit-content;
  padding-block: 3px;
}

.delete-button:hover {
  background-color: rgb(197, 35, 35);
  color: aliceblue;
}

.button-zone {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
