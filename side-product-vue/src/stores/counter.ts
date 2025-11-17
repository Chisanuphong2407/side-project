import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})

export const useProductIDStore = defineStore('id', () => {
  const currentProductID = ref<string>();

  const setProductID = (id: string) => {
    currentProductID.value = id
  }

  const resetProductID = () => {
    currentProductID.value = '';
  }

  return {
    currentProductID,
    setProductID,
    resetProductID,
  }
})
