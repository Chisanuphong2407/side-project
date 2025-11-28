import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserUIDStore = defineStore('uid', {
  state: () => {
    const currentUid = ref();
    return { currentUid };
  },
  actions: {
    setUid(id: string) {
      this.currentUid = id;
    }
  }
})
