<template>
  <div class="product-list">
    <!-- แสดงรายการ product -->
    <div v-for="p in product" :key="p._id" class="allProduct">
      <p>{{ p.productname }}</p>
      <p>{{ p.description }}</p>
      <p>{{ p.quantity }}</p>
      <p>{{ p.unit }}</p>
      <p>{{ p.price }}</p>
      <p>{{ p.image }}</p>
      <p>{{ p.catalog }}</p>
      <p>{{ p.ownerID }}</p>
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
        console.log(productfetch)

        product.value = productfetch.data
      } catch (error) {
        console.log(error)
      }
    })

    return {
      product,
    }
  },
}
</script>

<style scoped>
.product-list {
  display: flex;
  flex-direction: column;
  background-color: cornsilk;
  border-width: 10px;
}

.allProduct {
  display: flex;
  flex-direction: column;
  padding-inline: 20px;
  background-color: rgb(224, 172, 172);
  margin-block: 2px;
  border-width: 10vw;
}

.name {
}
</style>
