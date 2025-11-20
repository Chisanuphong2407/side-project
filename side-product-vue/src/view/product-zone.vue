<template>
  <div class="product-list">
    <!-- แสดงรายการ product -->
    <div v-for="p in product" :key="p._id" class="allProduct" @click="selectedItem(p._id)">
      <p class="name">{{ p.productname }}</p>
      <div v-if="selectItem == p._id" class="productDetails">
        <p class="name">{{ p.description }}</p>
        <p class="name">{{ p.quantity }}</p>
        <p class="name">{{ p.unit }}</p>
        <p class="name">{{ p.price }}</p>
        <p class="name">{{ p.catalog }}</p>
        <p class="name">{{ p.ownerID }}</p>
        <img
          :src="`${URL}` + p.image"
          alt="Product Image"
          style="max-width: auto; height: 300px; object-fit: contain"
          class="product-image"
        />
        <div class="button-zone">
          <button class="edit-button" @click="editProduct(p._id.toString())">แก้ไข</button>
          <button class="delete-button" @click="deleteProduct(p._id.toString())" >ลบสินค้า</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useProductIDStore } from '../stores/counter'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'productZone',
})

const URL = import.meta.env.VITE_API_BASE_URL
const product = ref<any[]>([])
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

const selectItem = ref(null)

const selectedItem = (p: any) => {
  if (selectItem?.value && selectItem.value === p) {
    selectItem.value = null // ปิดรายละเอียด
  } else {
    selectItem.value = p // เปิดรายละเอียด
  }
}

const editProduct = (product: string) => {
  productStore.setProductID(product)
  router.push('/editProduct')
}

const deleteProduct = async (product: string) => {
  try {
    await axios.delete(`${URL}/product/${product}`);
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
  background-color: cornsilk;
}

.allProduct {
  display: flex;
  flex-direction: column;
  background-color: rgb(224, 172, 172);
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
