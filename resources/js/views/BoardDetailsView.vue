<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useBoardDetailsStore } from '@/stores/boardDetailsStore'
import { storeToRefs } from 'pinia'
import { formatDate } from '@/utils/dateFormatter'
import { computed, ref } from 'vue'
import type { Task, TaskStatus } from '@/types/boardDetails'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Card from 'primevue/card'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import { useConfirm } from "primevue/useconfirm"

defineOptions({
    name: 'BoardDetailsView'
})

const route = useRoute()
const boardDetailsStore = useBoardDetailsStore()
const { board, loading, error } = storeToRefs(boardDetailsStore)

const confirm = useConfirm()

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

const showCreateDialog = ref(false)
const newTask = ref({
    title: '',
    description: '',
    task_status_id: computed(() => sortedTaskStatus.value[0]?.task_status_id) // Insert on the first status
})

const createTask = () => {
    showCreateDialog.value = true
}

const submitNewTask = async () => {
    if (!board.value) return
    
    await boardDetailsStore.createTask({
        ...newTask.value,
        board_id: board.value.id
    })
    showCreateDialog.value = false
    newTask.value = {
        title: '',
        description: '',
        task_status_id: sortedTaskStatus.value[0]?.task_status_id
    }
}

const deleteTask = async (taskId: number) => {
    confirm.require({
        message: 'Are you sure you want to delete this task?',
        header: 'Delete Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
            await boardDetailsStore.deleteTask(taskId)
        }
    })
}

onMounted(async () => {
    const boardId = parseInt(route.params.id as string)
    if (!isNaN(boardId)) {
        await boardDetailsStore.fetchBoardDetails(boardId)
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
            <Dialog 
                v-model:visible="showCreateDialog" 
                modal 
                header="Create New Task"
                :style="{ width: '50vw' }"
            >
                <div class="flex flex-column gap-2">
                    <div class="field">
                        <label for="title">Task Title</label>
                        <InputText 
                            id="title" 
                            v-model="newTask.title" 
                            required 
                            class="w-full"
                        />
                    </div>
                    <div class="field">
                        <label for="description">Description</label>
                        <Textarea 
                            id="description" 
                            v-model="newTask.description" 
                            rows="3" 
                            class="w-full"
                        />
                    </div>
                </div>
                <template #footer>
                    <Button 
                        label="Cancel" 
                        @click="showCreateDialog = false" 
                        class="p-button-text"
                    />
                    <Button 
                        label="Create" 
                        @click="submitNewTask" 
                        :disabled="!newTask.title"
                    />
                </template>
            </Dialog>

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
            <Button label="+ New Task" severity="info" class="ml-2 mb-4" @click="createTask()"></Button>
            <DataTable :value="tableData" tableStyle="min-width: 50rem">
                <Column v-for="status in sortedTaskStatus" 
                        :key="status.id" 
                        :header="status.name"
                        class="task-card-container">
                    <template #body="{ data }">
                        <Card v-if="data[status.task_status_id]"
                              class="task-card m-2">
                            <template #title>
                                {{ data[status.task_status_id].title + ' id(' + data[status.task_status_id].id + ')' }}
                            </template>
                            <template #content>
                                <p>{{ data[status.task_status_id].description }}</p>
                                <div v-if="data[status.task_status_id].assignee_id">
                                    Assigned to: {{ data[status.task_status_id].assignee_name }}
                                </div>
                                <Button label="DELETE" severity="danger" class="ml-2 mb-4" @click="deleteTask(data[status.task_status_id].id)"></Button>
                            </template>
                        </Card>
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>    
    <ConfirmDialog />
</template>

<style scoped>
.task-card {
    min-width: 200px;
}

.task-card.p-card.p-component {
  background-color: theme('colors.teal.900') !important;
}
</style> 