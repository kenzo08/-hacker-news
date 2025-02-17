<script setup lang="ts">
import { useRoute } from 'vue-router'
import type { Comment, Story } from '@/types'
import AnimationSpinner from '@/components/AnimationSpinner.vue'
import { formatDate } from '@/utils'
import { useNewsStores } from '@/composables/news-stores'
import { onMounted, ref } from 'vue'
import { useEventListener } from '@vueuse/core'

const route = useRoute()
const id = Number(route.params.id)
const story = ref<Story>()
const comments = ref<Comment[]>([])
const isLoading = ref(false)
const isLoadingComments = ref(false)
const currentCommentCount = ref(5)


const { fetchStory, fetchStoryComment } = useNewsStores()


const fetchComments = async (ids: number[], isRefresh?: boolean) => {
  if(!ids?.length)
    return

  if (isRefresh)
    comments.value = []

  isLoadingComments.value = true
  try {
    const storyPromises = ids.map((id: number)=>fetchStoryComment(id))
    const newStories = await Promise.all(storyPromises)
    comments.value.push(...newStories)
    comments.value = comments.value.sort((a, b) => b.time - a.time)
  } catch (error) {
    console.error('Ошибка при получении комментов:', error)
  } finally {
    isLoadingComments.value = false
  }
}

const handleScroll = () => {
  const bottomOffset = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
  if (bottomOffset && !isLoadingComments.value && comments.value.length && story.value?.kids) {
    currentCommentCount.value =  currentCommentCount.value + 5
    fetchComments(story.value?.kids.slice(comments.value?.length, currentCommentCount.value))
  }
}

useEventListener(window, 'scroll', handleScroll)

onMounted(async ()=>{
  isLoading.value = true
  story.value = await fetchStory(id)
  if (story.value?.kids)
    await fetchComments(story.value?.kids)

  isLoading.value = false

})
</script>
<template>
  <div class="flex flex-col gap-2.5 lg:mx-auto w-full h-screen p-4">
    <button
      v-if="story?.kids?.length"
      @click="fetchComments(story?.kids, true)"
      class="lg:p-4 p-3 rounded-xl lg:rounded-2xl bg-emerald-200 hover:bg-emerald-400 text-black text-xs lg:text-xl w-max">
      Refresh comments
    </button>
    <AnimationSpinner v-if="isLoading || isLoadingComments" />
    <div v-else class="flex flex-col text-xs h-full">
      <div v-if="story">
        <h1 class="text-xl lg:text-3xl font-bold text-[#35eb9a] px-3">
          <a :href="story?.url" target="_blank">
            {{story?.title}}
          </a>
        </h1>
        <span v-if="story?.time">
          {{formatDate(story.time)}}
        </span>
      </div>
      <div v-if="comments?.length" class="flex flex-col mt-56 gap-4">
        <h2 class="text-2xl">Comments</h2>
        <div v-for="comment in comments" :key="comment.id" class="bg-gray-50 text-black rounded-2xl w-full lg:w-[350px] p-4">
          <p> by {{ comment?.by }} | Date: {{ formatDate(comment.time) }}</p>
          <p> {{ comment.text }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
