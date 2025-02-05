<script setup lang="ts">
import {User} from '@/types/user'
import { ref, onMounted } from 'vue'
import useAuth from '@/stores/authStore'
import axios from 'axios'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ToggleSwitch  from 'primevue/toggleswitch'
import { useToast } from 'primevue/usetoast'

const users = ref<User[]>([])
const authStore = useAuth()
const toast = useToast()

const toggleAdminRole = async (user: User) => {
  if (user.id === authStore.user.value?.id) {
    return // Prevent self-toggle
  }

  try {
    const isAdmin = user.roles.includes('admin')
    const endpoint = isAdmin ? `/users/${user.id}/remove-admin` : `/users/${user.id}/assign-admin`
    await axios.post(endpoint)
    
    // Update local state
    const updatedUser = { ...user }
    if (isAdmin) {
      updatedUser.roles = updatedUser.roles.filter(role => role !== 'admin')
    } else {
      updatedUser.roles = [...updatedUser.roles, 'admin']
    }
    users.value = users.value.map(u => u.id === user.id ? updatedUser : u)

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: `Admin role ${isAdmin ? 'removed from' : 'assigned to'} ${user.name}`,
      life: 3000
    })
  } catch (error) {
    console.error('Failed to toggle admin role:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to update admin role',
      life: 3000
    })
  }
}

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
      <Column header="Admin" sortable :sortField="(item) => item.roles.includes('admin')">
        <template #body="{ data }">
          <ToggleSwitch  
            :modelValue="data.roles.includes('admin')"
            @update:modelValue="() => toggleAdminRole(data)"
            :disabled="data.id === authStore.user.value?.id"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>