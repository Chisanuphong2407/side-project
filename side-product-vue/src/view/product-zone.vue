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
          :src="'http://localhost:3000' + p.image"
          alt="Product Image"
          style="max-width: auto; height: 300px; object-fit: contain;"
          class="product-image"
        />
        <button class="edit-button" @click="editProduct(p._id.toString())">แก้ไข</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" >
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useProductIDStore } from '@/stores/counter';
import { useRouter } from 'vue-router';
export default {
  name: 'productZone',
  setup: () => {
    const product = ref<any[]>([])
    const productStore = useProductIDStore()
    const router = useRouter();

    onMounted(async () => {
      try {
        //fetch product ทั้งหมดออกมา
        const productfetch = await axios.get('http://localhost:3000/product')
        // console.log(productfetch)

        product.value = productfetch.data
      } catch (error) {
        console.log(error)
      }
    })

    const selectItem = ref(null)

    const selectedItem = (p: any) => {
      if (selectItem.value && selectItem.value === p) {
        selectItem.value = null // ปิดรายละเอียด
      } else {
        selectItem.value = p // เปิดรายละเอียด
      }
    }

    const editProduct = (product: string) => {
      productStore.setProductID(product);
      router.push("/editProduct");
    }

    return {
      product,
      selectItem,
      selectedItem,
      editProduct,
    }
  },
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
</style>
