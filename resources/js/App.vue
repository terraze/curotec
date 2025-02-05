<script setup lang="ts">
import NavBar from './components/NavBar.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import Toast from 'primevue/toast'
</script>

<template>
  <LoadingOverlay />
  <div id="app" class="min-h-screen surface-ground">
    <Toast />
    <NavBar />
    <router-view v-slot="{ Component }" class="container mx-auto px-4 py-8">  
      <keep-alive include="BoardsView">  
        <component :is="Component" />  
      </keep-alive>  
    </router-view>
  </div>
</template>