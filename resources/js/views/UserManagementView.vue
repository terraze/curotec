<script setup lang="ts">
import {User} from '@/types/user'
import { ref, onMounted } from 'vue'
import useAuth from '@/stores/authStore'
import axios from 'axios'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const users = ref<User[]>([])
const authStore = useAuth()

onMounted(async () => {
  try {
    const response = await axios.get('/users')
    users.value = response.data
  } catch (error) {
    console.error('Failed to fetch users:', error)
  }
})
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">User Management</h1>
    
    <DataTable :value="users" stripedRows>
      <Column field="id" header="ID" sortable></Column>
      <Column field="name" header="Name" sortable></Column>
      <Column field="email" header="Email" sortable></Column>
      <Column header="Admin" sortable>
        <template #body="slotProps">
          {{ slotProps.data.roles.includes('admin') ? 'Yes' : 'No' }}
        </template>
      </Column>
    </DataTable>
  </div>
</template>