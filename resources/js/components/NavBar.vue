<script setup lang="ts">
import { RouterLink } from 'vue-router'
import useAuth from '../stores/authStore';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { computed, watch, ref, nextTick } from 'vue';

const auth = useAuth();
const router = useRouter();
const toast = useToast();

// Instead of destructuring, use a computed property
const isAuthenticated = computed(() => auth.authenticated);
const user = computed(() => auth.user);

const componentKey = ref(0)

const handleLogout = async () => {
    await auth.logout();
    // Force component re-render
    componentKey.value++
    await nextTick()
    toast.add({ severity: 'success', summary: 'Success', detail: 'Logged out successfully', life: 8000 });    
};

const handleLogin = () => {
    router.push('/login');
};
</script>

<template>
  <nav class="surface-primary shadow" :key="componentKey">
    <div class="container mx-auto px-4">
      <div class="flex justify-between h-16">
        <div class="flex">
          <RouterLink to="/" class="flex items-center">
            <span class="text-xl font-bold text-white">Collaborative Kanban Board</span>            
          </RouterLink>
          
          <div class="ml-10 flex items-center space-x-4">
            <RouterLink 
              to="/" 
              class="px-3 py-2 rounded-md text-sm font-medium text-white hover:surface-hover transition-colors"
              v-slot="{ isActive }"
            >
              <span :class="{ 'border-b-2 border-white pb-1': isActive }">Home</span>
            </RouterLink>
            <RouterLink 
              to="/boards" 
              class="px-3 py-2 rounded-md text-sm font-medium text-white hover:surface-hover transition-colors"
              v-slot="{ isActive }"
            >
              <span :class="{ 'border-b-2 border-white pb-1': isActive }">Boards</span>
            </RouterLink>
          </div>
        </div>
        <div class="ml-10 flex items-center space-x-4">
            <Button 
                v-if="!isAuthenticated.value" 
                label="Login" 
                @click="handleLogin"
                class="p-button-secondary"
            />
            <div v-if="isAuthenticated.value" :key="user.value.id">
              <Message severity="info">Logged in as {{ user.value.name }}</Message>
              <Button 
                v-if="isAuthenticated.value" 
                label="Logout" 
                @click="handleLogout"
                class="p-button-secondary"
            />
            </div>
            
        </div>
      </div>
    </div>
  </nav>
</template> 