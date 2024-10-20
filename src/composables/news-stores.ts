import { useFetch } from '@vueuse/core'
import { useGeneralStore } from '@/stores/general'
import { storeToRefs } from 'pinia'
import type { Comment, Story } from '@/types'

export function useNewsStores() {
  const store = useGeneralStore()
  const { storeIds } = storeToRefs(store)
  const url = 'https://hacker-news.firebaseio.com//v0/newstories.json?print=pretty'

  async function fetchStoreIds() {
   await useFetch(url, {
       afterFetch(ctx) {
         if (ctx.data) {
           storeIds.value = ctx.data.slice(0, 100)
         }

       },
     },
   ).get().json()
 }

  async function fetchStory(id: number) {
      const storyUrl = `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`
      const { data} = await useFetch<Story>(storyUrl).get().json()

      return data.value
    }

    async function fetchStoryComment(id: number) {
      const commentUrl = `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`
      const { data} = await useFetch<Comment>(commentUrl).get().json()

      return data.value
    }

  return { fetchStoreIds, fetchStory, fetchStoryComment }
}
