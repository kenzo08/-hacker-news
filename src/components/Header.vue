<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'


const router = useRouter()
const route = useRoute()

const navBarLinks: { link: string, name: string }[] =  [
  {
  link: '/',
  name: 'Home'
},
  {
    link: '/about-us',
    name: 'About us'
  },
]


function navigateBack(){
  router.back()
}
</script>

<template>
  <header class="flex sticky top-0 mx-auto gap-2.5 mb-2.5 bg-emerald-50 w-full text-black p-2 lg:p-4 items-center">
    <button v-show="route.name !== 'Home'" @click="navigateBack" class="absolute left-2 lg:left-4 text-xs lg:text-xl w-max">
      ← Back
    </button>
      <nav class="mx-auto">
        <RouterLink v-for="url in navBarLinks" :key="url.link" :to="url.link" active-class="text-[#35eb9a]" class="text-xs font-semibold lg:text-xl p-4">
          {{ url.name }}
        </RouterLink>
      </nav>
  </header>
</template>
