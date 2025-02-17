import { useFetch } from '@vueuse/core'
import { useGeneralStore } from '@/stores/general'
import { storeToRefs } from 'pinia'
import type { Comment, Story } from '@/types'

export function useNewsStores() {
  const store = useGeneralStore()
  const { storeIds } = storeToRefs(store)
  const url = 'https://hacker-news.firebaseio.com//v0/newstories.json?print=pretty'

  async function fetchStoreIds() {
  const {data} = await useFetch<number[]>(url).get().json()

    if(data.value)
      storeIds.value = data.value.slice(0, 100)
 }

  async function fetchStory(id: number): Promise<Story> {
      const storyUrl = `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`
      const { data} = await useFetch<Story>(storyUrl).get().json()

      return data.value
    }

    async function fetchStoryComment(id: number):Promise<Comment> {
      const commentUrl = `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`
      const { data} = await useFetch<Comment>(commentUrl).get().json()

      return data.value
    }

  return { fetchStoreIds, fetchStory, fetchStoryComment }
}
