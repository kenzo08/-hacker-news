import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGeneralStore = defineStore('general', ()=> {
  const storeIds = ref<number[]>([])

  return { storeIds}
})
