<script setup lang="ts">
import { onMounted } from 'vue'
import { useBoardsStore } from '@/stores/boardsStore'
import { formatDate } from '@/utils/dateFormatter'

const boardsStore = useBoardsStore()

onMounted(() => {
    boardsStore.fetchBoards()
})

const deleteBoard = async (boardId: number) => {
    if (confirm('Are you sure you want to delete this board?')) {
        await boardsStore.deleteBoard(boardId)
    }
}

defineOptions({
    name: 'BoardsView'
})
</script>

<template>
  <div class="boards-container">
    <div v-if="boardsStore.loading">
        Loading boards...
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
            <Column field="created_at" header="Created At">
                <template #body="{ data }">
                    {{ formatDate(data.created_at) }}
                </template>
            </Column>
            <Column field="updated_at" header="Updated At">
                <template #body="{ data }">
                    {{ formatDate(data.updated_at) }}
                </template>
            </Column>
            <Column header="">
                <template #body="{ data }">
                    <router-link 
                      :to="{ name: 'board', params: { id: data.id }}" 
                      class="view-board-btn"
                    >
                    <Button label="Go to Board"></Button>
                    </router-link>
                    <Button label="DELETE" severity="danger" class="ml-2" @click="deleteBoard(data.id)"></Button>
                </template>
            </Column>
        </DataTable>      
    </div>
  </div>
</template>

<style scoped>

</style> 