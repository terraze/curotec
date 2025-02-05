<script setup lang="ts">
import { useBoardDetailsStore } from '@/stores/boardDetailsStore'
import type { Task } from '@/types/boardDetails'
import Card from 'primevue/card'
import Button from 'primevue/button'
import UserSelect from '@/components/UserSelect.vue'
import { useConfirm } from "primevue/useconfirm"
import { useToast } from 'primevue/usetoast'

const props = defineProps<{
    task: Task
}>()

const boardDetailsStore = useBoardDetailsStore()
const confirm = useConfirm()
const toast = useToast()

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

const handleAssigneeChange = async (event: any) => {
    try {
        await boardDetailsStore.updateAssignee(props.task.id, event, toast)
    } catch (error) {
        console.log('Failed to update assignee:', error)
    }
}
</script>

<template>
    <Card class="task-card m-2 min-w-[200px] cursor-move transform transition-transform hover:-translate-y-0.5"
          draggable="true"
          @dragstart="(e) => {
              e.dataTransfer.effectAllowed = 'move'
              e.dataTransfer.setData('taskId', task.id.toString())
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
                @update:modelValue="handleAssigneeChange" />
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
</style>