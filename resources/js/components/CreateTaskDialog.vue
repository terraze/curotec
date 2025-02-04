<script setup lang="ts">
import { ref, computed } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import { useBoardDetailsStore } from '@/stores/boardDetailsStore'

const props = defineProps<{
    modelValue: boolean,
    boardId: number,
    initialTaskStatusId: number
}>()

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
}>()

const boardDetailsStore = useBoardDetailsStore()

const newTask = ref({
    title: '',
    description: '',
    task_status_id: computed(() => props.initialTaskStatusId)
})

const submitNewTask = async () => {
    await boardDetailsStore.createTask({
        ...newTask.value,
        board_id: props.boardId
    })
    emit('update:modelValue', false)
    newTask.value = {
        title: '',
        description: '',
        task_status_id: props.initialTaskStatusId
    }
}
</script>

<template>
    <Dialog 
        :visible="modelValue" 
        @update:visible="(value) => emit('update:modelValue', value)"
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
                @click="emit('update:modelValue', false)" 
                class="p-button-text"
            />
            <Button 
                label="Create" 
                @click="submitNewTask" 
                :disabled="!newTask.title"
            />
        </template>
    </Dialog>
</template> 