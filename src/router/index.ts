import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/views/NotFoundView.vue') },
    { path: '/', name: 'Home', component: ()=> import( '@/views/HomeView.vue') },
    { path: '/story/:id', name: 'Story', component: () => import('@/views/StoryView.vue')},
    { path: '/about-us', name: 'AboutUs', component: () => import('@/views/AboutView.vue')}
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

export default router
