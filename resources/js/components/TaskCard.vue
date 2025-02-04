<script setup lang="ts">
import { useBoardDetailsStore } from '@/stores/boardDetailsStore'
import type { Task } from '@/types/boardDetails'
import Card from 'primevue/card'
import Button from 'primevue/button'
import UserSelect from '@/components/UserSelect.vue'
import { useConfirm } from "primevue/useconfirm"

const props = defineProps<{
    task: Task
}>()

const boardDetailsStore = useBoardDetailsStore()
const confirm = useConfirm()

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
</script>

<template>
    <Card class="task-card m-2"
          draggable="true"
          @dragstart="(e) => {
              e.dataTransfer.effectAllowed = 'move'
              e.dataTransfer.setData('taskId', task.id.toString())
          }"
          :pt="{
              root: { style: 'cursor: move' }
          }">
        <template #title>
            {{ task.title + ' id(' + task.id + ')' }}
        </template>
        <template #content>
            <p>{{ task.description }}</p>
            <strong>Assigned to:</strong>
            <UserSelect
                v-model="task.assignee_id"
                placeholder="Select Assignee"
                class="mt-4 ml-4 w-1/2"
                @change="(value) => boardDetailsStore.updateTaskAssignee(task.id, value)" />
            <Button label="DELETE" severity="danger" class="mt-4 ml-4" @click="deleteTask(task.id)"></Button>
        </template>
    </Card>
</template>

<style scoped>
.task-card.p-card.p-component {
    background-color: theme('colors.teal.900') !important;
}

.task-card.p-card.p-component:hover {
    background-color: theme('colors.teal.800') !important;
}

.task-card {
    min-width: 200px;
    transition: transform 0.2s;
}

.task-card:hover {
    transform: translateY(-2px);
}

.task-card[draggable="true"]:active {
    cursor: grabbing;
}
</style> 