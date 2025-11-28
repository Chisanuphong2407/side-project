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

export const useUserUIDStore = defineStore('uid', () => {
  const currentUid = ref<string>()

  const setUid = (uid: string) => {
    currentUid.value = uid
  }

  return { currentUid, setUid }
})

export const useUserNameStore = defineStore('username', () => {
  const currentUsername = ref<string>('')

  const setUsername = (username: string) => {
    currentUsername.value = username
  }

  return { currentUsername, setUsername }
})
