import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserNameStore = defineStore('username', {
  state: () => {
    const currentUsername = ref()
    return { currentUsername }
  },
  actions: {
    setUsername(username: string) {
      this.currentUsername = username
    },
  },
})
