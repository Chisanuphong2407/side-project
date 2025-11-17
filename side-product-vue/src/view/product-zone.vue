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
        <p class="name">{{ p.image }}</p>
        <p class="name">{{ p.catalog }}</p>
        <p class="name">{{ p.ownerID }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" >
import { ref, onMounted } from 'vue'
import axios from 'axios'
export default {
  name: 'productZone',
  setup: () => {
    const product = ref<any[]>([])

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
    selectItem.value = null; // ปิดรายละเอียด
  } else {
    selectItem.value = p; // เปิดรายละเอียด
  }
    }

    return {
      product,
      selectItem,
      selectedItem,
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
  background-color: rgb(192, 148, 148);
}
.name {
  margin: 3px;
}
</style>
