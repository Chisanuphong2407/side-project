<template>
  <div>
    <form>
      <input/>
    </form>
  </div>
</template>

<script lang="ts">
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useProductIDStore } from '@/stores/counter';

interface Product {
_id:string ;
productname: string;
description:string;
quantity:number;
unit:string;
price:number;
image:string;
catalog:string;
ownerID:string;
}

export default {
  name: 'editProduct',
  setup: () => {
    const product = ref<Product | null>()
    const productStore = useProductIDStore()

    const productID = productStore.currentProductID

    onMounted(async () => {
      const fetchProduct = await axios.get(`http://localhost:3000/product/${productID}`)
      console.log('edit', productID)
      product.value = fetchProduct.data
      console.log('data', product.value)

      return {
        product,
      }
    })
  },
}
</script>

<style>
</style>