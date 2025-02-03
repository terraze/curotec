<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="bg-white shadow">
    <div class="container mx-auto px-4">
      <div class="flex justify-between h-16">
        <div class="flex">
          <RouterLink to="/" class="flex items-center">
            <span class="text-xl font-bold">Collaborative Kanban Board</span>            
          </RouterLink>
          
          <div class="ml-10 flex items-center space-x-4">
            <RouterLink 
              to="/" 
              class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Dashboard
            </RouterLink>
            <RouterLink 
              to="/boards" 
              class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Boards
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template> 