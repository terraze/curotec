<script lang="ts">
import { defineComponent } from 'vue'
import NavBar from './components/NavBar.vue'

export default defineComponent({
  name: 'App',
  components: {
    NavBar
  }
})
</script>

<template>
  <div id="app" class="min-h-screen surface-ground">
    <nav-bar></nav-bar>    
    <router-view v-slot="{ Component }" class="container mx-auto px-4 py-8">  
        <keep-alive include="BoardsView">  
        <component :is="Component" />  
        </keep-alive>  
  </router-view>
  </div>
</template>