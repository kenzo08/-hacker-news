<script setup lang="ts">
import { useArrayDifference, useEventListener, useIntervalFn } from '@vueuse/core'
import { onMounted, ref } from 'vue'
import type { Story } from '@/types'
import AnimationSpinner from '@/components/AnimationSpinner.vue'
import { formatDate } from '@/utils'
import { useGeneralStore } from '@/stores/general'
import { storeToRefs } from 'pinia'
import { useNewsStores } from '@/composables/news-stores'

const store = useGeneralStore()
const { storeIds } = storeToRefs(store)
const { fetchStoreIds, fetchStory } = useNewsStores()

const stories = ref<Story[]>([])
const baseStoreIds = ref<number[]>([])
const isLoadingStories = ref(false)
const currentStoryCount = ref(20)


const fetchStories = async (ids: number[]) => {
    isLoadingStories.value = true
    try {
      const storyPromises = ids.map((id: number)=>fetchStory(id))
      const newStories = await Promise.all(storyPromises)
      stories.value.push(...newStories)
      stories.value = stories.value.sort((a, b) => b.time - a.time)
    } catch (error) {
      console.error('Ошибка при получении новостей:', error)
    } finally {
      isLoadingStories.value = false
    }
}

const handleScroll = () => {
  const bottomOffset = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
  if (bottomOffset && !isLoadingStories.value && stories.value.length < 100) {
    currentStoryCount.value =  currentStoryCount.value + 20
    fetchStories(storeIds.value.slice(stories.value.length, currentStoryCount.value))
  }
}

useEventListener(window, 'scroll', handleScroll)

useIntervalFn(async () => {
  await fetchStoreIds()
  const newStoreIds = useArrayDifference(baseStoreIds.value, storeIds.value)
  if (newStoreIds.value.length){
    baseStoreIds.value = storeIds.value
    await fetchStories(newStoreIds.value)
  }

}, 60000)

onMounted(async ()=>  {
  isLoadingStories.value = true
 if (!storeIds.value.length){
   await fetchStoreIds()
   baseStoreIds.value = storeIds.value
 }
  await fetchStories(storeIds.value.slice(0, currentStoryCount.value))
  isLoadingStories.value = false
})
</script>

<template>
  <div class="flex flex-col gap-4 mx-auto w-full lg:w-max px-4">
    <h1 class="text-2xl lg:text-4xl text-gray-50 text-center font-bold">Hacker News</h1>
    <ul class=" flex flex-col gap-2.5 w-full">
      <li v-for="(story, index) in stories" :key="story.id" class="text-xs text-gray-50 w-full lg:w-max">
        <router-link :to="`/story/${story.id}`" class="flex items-center text-lg lg:text-xl font-bold text-[#35eb9a] px-3">
          {{index + 1}}. {{ story.title }}
        </router-link>
        <p> Score: {{ story.score }} | by {{ story?.by }} | Date: {{ formatDate(story.time) }}</p>
      </li>
    </ul>
    <AnimationSpinner v-if="isLoadingStories"/>
  </div>
</template>
