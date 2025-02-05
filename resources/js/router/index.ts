import { createRouter, createWebHistory } from 'vue-router'
import useAuth from '../stores/authStore'
import HomeView from '../views/HomeView.vue'
import BoardsView from '@/views/BoardsView.vue'
import BoardDetailsView from '@/views/BoardDetailsView.vue'
import LoginView from '@/views/LoginView.vue'
import UserManagementView from '@/views/UserManagementView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: false }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false }
    },
    {
      path: '/boards',
      name: 'boards',
      component: BoardsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/boards/:id',
      name: 'board',
      component: BoardDetailsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/user-management',
      name: 'user-management',
      component: UserManagementView,
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuth()
  const authenticated = auth.authenticated.value

  if (to.meta.requiresAuth && !authenticated) {
    next('/login')
    return
  }

  if (to.path === '/login' && authenticated) {
    next('/')
  } else {
    next()
  }

  if (to.meta.requiresAdmin && !auth.user.value?.roles?.includes('admin')) {
    next({ name: 'home' })
  }
})

export default router 