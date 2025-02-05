<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import NavBar from './components/NavBar.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import { useUserStore } from '@/stores/userStore'
import Toast from 'primevue/toast'

export default defineComponent({
  name: 'App',
  components: {
    NavBar,
    LoadingOverlay,
    Toast
  },
  setup() {
    const userStore = useUserStore()

    onMounted(async () => {
      await userStore.fetchUsers()
    })

    return {}
  }
})
</script>

<template>
  <LoadingOverlay />
  <div id="app" class="min-h-screen surface-ground">
    <Toast />
    <nav-bar></nav-bar>    
    <router-view v-slot="{ Component }" class="container mx-auto px-4 py-8">  
        <keep-alive include="BoardsView">  
        <component :is="Component" />  
        </keep-alive>  
  </router-view>
  </div>
</template>