<script setup lang="ts">
import { onMounted } from 'vue'
import { useBoardsStore } from '@/stores/boardsStore'

const boardsStore = useBoardsStore()

onMounted(() => {
  boardsStore.fetchBoards()
})
</script>

<template>
  <div class="boards-container">
    <div v-if="boardsStore.loading">
        <i class="pi pi-spin pi-spinner text-white" style="font-size: 4rem"></i>
    </div>

    <div v-else-if="boardsStore.error">
        <Message severity="error">{{ boardsStore.error }}</Message>
    </div>
    

    <div v-else>
        <DataTable :value="boardsStore.boards" tableStyle="min-width: 50rem">
            <Column field="id" header="ID"></Column>
            <Column field="name" header="Board Name"></Column>
            <Column field="description" header="Description"></Column>
            <Column field="created_by" header="Created By"></Column>
            <Column field="created_at" header="Created At"></Column>
            <Column field="updated_at" header="Updated At"></Column>
        </DataTable>      
    </div>
  </div>
</template>

<style scoped>

</style> 