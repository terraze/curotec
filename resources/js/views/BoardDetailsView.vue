<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useBoardDetailsStore } from '@/stores/boardDetailsStore'
import { storeToRefs } from 'pinia'
import { formatDate } from '@/utils/dateFormatter'
import { computed, ref } from 'vue'
import type { Task, TaskStatus } from '@/types/boardDetails'
import OrderList from 'primevue/orderlist'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Card from 'primevue/card'

defineOptions({
    name: 'BoardDetailsView'
})

const route = useRoute()
const boardStore = useBoardDetailsStore()
const { board, loading, error } = storeToRefs(boardStore)

// Sort task status by sort_order
const sortedTaskStatus = computed(() => {
    return [...(board.value?.task_status || [])].sort((a, b) => a.sort_order - b.sort_order)
})

// Group tasks by status
const tasksByStatus = computed(() => {
    const grouped: { [key: number]: Task[] } = {}
    board.value?.task_status.forEach(status => {
        // Group tasks by status to add on proper column
        grouped[status.task_status_id] = board.value?.tasks.filter(
            task => task.task_status_id === status.task_status_id
        ) || []
    })
    return grouped
})

// Create a data structure for the table
const tableData = computed(() => {
    const maxTasks = Math.max(...Object.values(tasksByStatus.value).map(tasks => tasks.length))
    const rows = []
    
    // Put each task on the proper row (this makes sure all columns will not have empty rows above the tasks)
    for (let i = 0; i < maxTasks; i++) {
        const row: { [key: number]: Task | null } = {}
        sortedTaskStatus.value.forEach(status => {
            row[status.task_status_id] = tasksByStatus.value[status.task_status_id][i] || null
        })
        rows.push(row)
    }
    
    return rows
})

const handleReorder = async (event: any) => {
    // TODO: Implement API call to update task order
    console.log('Reorder event:', event)
}

onMounted(async () => {
    const boardId = parseInt(route.params.id as string)
    if (!isNaN(boardId)) {
        await boardStore.fetchBoardDetails(boardId)
    }
})

onUnmounted(() => {
    boardStore.reset()
})
</script>

<template>
    <div class="board-details-container">
        <div v-if="loading">
            Loading board...
        </div>

        <div v-else-if="error">
            <Message severity="error">{{ error }}</Message>
        </div>

        <div v-else-if="board" class="max-w-4xl mx-auto">
            <Card class="surface-card">
                <template #title>
                    {{ board.name }}
                </template>
                <template #content>
                    <p>{{ board.description }}</p>
                    <div class="board-info mt-4">
                        <p>Created by: {{ board.created_by }}, at {{ formatDate(board.created_at) }}</p>
                    </div>
                </template>
            </Card>
            <DataTable :value="tableData" tableStyle="min-width: 50rem">
                <Column v-for="status in sortedTaskStatus" 
                        :key="status.id" 
                        :header="status.name"
                        class="task-card-container">
                    <template #body="{ data }">
                        <Card v-if="data[status.task_status_id]"
                              class="task-card m-2">
                            <template #title>
                                {{ data[status.task_status_id].title + ' id(' + status.task_status_id + ')' }}
                            </template>
                            <template #content>
                                <p>{{ data[status.task_status_id].description }}</p>
                                <div v-if="data[status.task_status_id].assignee_id">
                                    Assigned to: {{ data[status.task_status_id].assignee_name }}
                                </div>
                            </template>
                        </Card>
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>    
</template>

<style scoped>
.task-card {
    min-width: 200px;
}

.task-card.p-card.p-component {
  background-color: theme('colors.teal.900') !important;
}
</style> 