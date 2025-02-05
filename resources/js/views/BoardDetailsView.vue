<script setup lang="ts">
import { onMounted, onUnmounted, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useBoardDetailsStore } from '@/stores/boardDetailsStore'
import { storeToRefs } from 'pinia'
import { formatDate } from '@/utils/dateFormatter'
import type { Task } from '@/types/boardDetails'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Message from 'primevue/message'
import { useLoadingStore } from '@/stores/loadingStore'
import TaskCard from '@/components/TaskCard.vue'
import CreateTaskDialog from '@/components/CreateTaskDialog.vue'
import ConfirmDialog from 'primevue/confirmdialog'

defineOptions({
    name: 'BoardDetailsView'
})

const route = useRoute()
const boardDetailsStore = useBoardDetailsStore()
const { board, loading, error } = storeToRefs(boardDetailsStore)

// Sort task status by sort_order
const sortedTaskStatus = computed(() => {
    return [...(board.value?.task_status || [])].sort((a, b) => a.sort_order - b.sort_order)
})

// Group tasks by status
const tasksByStatus = computed(() => {
    const grouped: { [key: number]: Task[] } = {}
    board.value?.task_status.forEach(status => {
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
    
    for (let i = 0; i < maxTasks; i++) {
        const row: { [key: number]: Task | null } = {}
        sortedTaskStatus.value.forEach(status => {
            row[status.task_status_id] = tasksByStatus.value[status.task_status_id][i] || null
        })
        rows.push(row)
    }
    
    return rows
})

const showCreateDialog = ref(false)

const handleDrop = async (event: DragEvent, newStatusId: number) => {
    const taskId = event.dataTransfer?.getData('taskId')
    if (!taskId) return

    const loadingStore = useLoadingStore()
    loadingStore.startLoading()
    
    try {
        await boardDetailsStore.updateTaskStatus(parseInt(taskId, 10), newStatusId)
    } catch (error) {
        console.error('Failed to update task status:', error)
    } finally {
        loadingStore.stopLoading()
    }
}

const onDragOver = (event: DragEvent) => {
    if (event.currentTarget instanceof HTMLElement) {
        event.currentTarget.classList.add('drag-over')
    }
}

const onDragEnter = (event: DragEvent) => {
    if (event.currentTarget instanceof HTMLElement) {
        event.currentTarget.classList.add('drag-over')
    }
}

const onDragLeave = (event: DragEvent) => {
    if (event.currentTarget instanceof HTMLElement) {
        event.currentTarget.classList.remove('drag-over')
    }
}

onMounted(async () => {
    const boardId = parseInt(route.params.id as string)
    if (!isNaN(boardId)) {
        await boardDetailsStore.fetchBoardDetails(boardId)
        console.log('Attempting to connect to WebSocket...');
        
        window.Echo.connector.pusher.connection.bind('state_change', (states: any) => {
            console.log('Connection states:', states);
        });
        
        window.Echo.channel('tasks')
            .listen('TaskUpdated', (e: any) => {
                console.log('Received task update:', e);
            })
            .error((error: any) => {
                console.error('Channel error:', error);
            });
    }
})

onUnmounted(() => {
    boardDetailsStore.reset()
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

        <div v-else-if="board" class="w-2/3 mx-auto">            
            <CreateTaskDialog
                v-model="showCreateDialog"
                :board-id="board.id"
                :initial-task-status-id="sortedTaskStatus[0]?.task_status_id"
            />

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
            
            <Button label="+ New Task" severity="info" class="ml-2 mb-4" @click="showCreateDialog = true"></Button>
            
            <DataTable :value="tableData" tableStyle="min-width: 50rem">
                <Column v-for="status in sortedTaskStatus" 
                        :key="status.id" 
                        :header="status.name"
                        class="w-1/3"
                        >
                    <template #body="{ data }">
                        <div class="task-card-container"
                             @drop.prevent="handleDrop($event, status.task_status_id)"
                             @dragover.prevent="onDragOver"
                             @dragenter.prevent="onDragEnter"
                             @dragleave.prevent="onDragLeave">
                            <TaskCard 
                                v-if="data[status.task_status_id]"
                                :task="data[status.task_status_id]"
                            />
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>    
    <ConfirmDialog />
</template>

<style scoped>
.task-card-container {
    min-height: 100px;
    height: 100%;
    width: 100%;
    padding: 0.5rem;
    transition: background-color 0.2s;
}

.drag-over {
    background-color: rgba(0, 128, 128, 0.1);
    border: 2px dashed teal;
}
</style> 