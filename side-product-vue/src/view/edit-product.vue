<template>
  <div>
    <div>แก้ไขข้อมูล</div>
    <div v-if="product">
      <div v-for="p in product" :key="p._id">
        <p>{{ p.productname }}</p>
        <p>{{ p.description }}</p>
        <p>{{ p.quantity }}</p>
        <p>{{ p.unit }}</p>
        <p>{{ p.price }}</p>
        <p>{{ p.catalog }}</p>
        <p>{{ p.ownerID }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue'
import { useProductIDStore } from '@/stores/counter'
import axios from 'axios'
export default {
  name: 'editProduct',
  setup: () => {
    const product = ref()
    const productStore = useProductIDStore()

    onMounted(async () => {
      const productID = productStore.currentProductID;
      console.log(productID)
      try {
        const productData = await axios.get(
          `http://localhost:3000/product/${productID}`
        )

        product.value = productData.data
      } catch (error) {
        alert('error')
        console.log(error)
      }
    })
    return {
      product,
    }
  },
}
</script>

<style>
</style>
