<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useBoardsStore } from '@/stores/boardsStore'
import { formatDate } from '@/utils/dateFormatter'
import { useConfirm } from "primevue/useconfirm"
import CreateBoardDialog from '@/components/CreateBoardDialog.vue'
import { useUserStore } from '@/stores/userStore'

defineOptions({
    name: 'BoardsView'
})

const boardsStore = useBoardsStore()
const showCreateDialog = ref(false)
const confirm = useConfirm()
const userStore = useUserStore()

onMounted(async () => {
    await boardsStore.fetchBoards()
    await userStore.fetchUsers()
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
            <Button label="+ New Board" severity="info" class="ml-2 mb-4" @click="showCreateDialog = true"></Button>
            
            <CreateBoardDialog v-model="showCreateDialog" />

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