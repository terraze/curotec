<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useBoardDetailsStore } from '@/stores/boardDetailsStore'
import { storeToRefs } from 'pinia'
import { formatDate } from '@/utils/dateFormatter'

defineOptions({
    name: 'BoardDetailsView'
})

const route = useRoute()
const boardStore = useBoardDetailsStore()
const { board, loading, error } = storeToRefs(boardStore)

onMounted(async () => {
    const boardId = parseInt(route.params.id as string)
    if (!isNaN(boardId)) {
        await boardStore.fetchBoard(boardId)
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
        </div>
    </div>    
</template>

<style scoped>
</style> 