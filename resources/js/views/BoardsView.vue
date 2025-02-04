<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useBoardsStore } from '@/stores/boardsStore'
import { formatDate } from '@/utils/dateFormatter'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import { useConfirm } from "primevue/useconfirm"

const boardsStore = useBoardsStore()
const showCreateDialog = ref(false)
const newBoard = ref({
    name: '',
    description: ''
})

const confirm = useConfirm()

onMounted(() => {
    boardsStore.fetchBoards()
})

const deleteBoard = async (boardId: number) => {
    confirm.require({
        message: 'Are you sure you want to delete this board?',
        header: 'Delete Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
            await boardsStore.deleteBoard(boardId)
        }
    })
}

const createBoard = () => {
    showCreateDialog.value = true
}

const submitNewBoard = async () => {
    await boardsStore.createBoard(newBoard.value)
    showCreateDialog.value = false
    newBoard.value = { name: '', description: '' }
}

defineOptions({
    components: {
        Dialog,
        InputText,
        Textarea
    },
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

    <div v-else class="w-2/3 mx-auto">
        <Button label="+ New Board" severity="info" class="ml-2 mb-4" @click="createBoard()"></Button>
        
        <Dialog 
            v-model:visible="showCreateDialog" 
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
                    @click="showCreateDialog = false" 
                    class="p-button-text"
                />
                <Button 
                    label="Create" 
                    @click="submitNewBoard" 
                    :disabled="!newBoard.name"
                />
            </template>
        </Dialog>

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
  <ConfirmDialog />
</template>

<style scoped>

</style> 