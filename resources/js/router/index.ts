import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BoardsView from '@/views/BoardsView.vue'
import BoardDetailsView from '@/views/BoardDetailsView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/boards',
      name: 'boards',
      component: BoardsView
    },
    {
      path: '/boards/:id',
      name: 'board',
      component: BoardDetailsView
    }
  ]
})

export default router 