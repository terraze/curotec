<script setup lang="ts">
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import { useBoardsStore } from '@/stores/boardsStore'

const props = defineProps<{
    modelValue: boolean
}>()

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
}>()

const boardsStore = useBoardsStore()

const newBoard = ref({
    name: '',
    description: ''
})

const submitNewBoard = async () => {
    await boardsStore.createBoard(newBoard.value)
    emit('update:modelValue', false)
    newBoard.value = { name: '', description: '' }
}
</script>

<template>
    <Dialog 
        :visible="modelValue" 
        @update:visible="(value) => emit('update:modelValue', value)"
        modal 
        header="Create New Board"
        :style="{ width: '50vw' }"
    >
        <div class="flex flex-column gap-2">
            <div class="field">
                <label for="name">Board Name</label>
                <InputText 
                    id="name" 
                    v-model="newBoard.name" 
                    required 
                    class="w-full"
                />
            </div>
            <div class="field">
                <label for="description">Description</label>
                <Textarea 
                    id="description" 
                    v-model="newBoard.description" 
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
                @click="submitNewBoard" 
                :disabled="!newBoard.name"
            />
        </template>
    </Dialog>
</template> 