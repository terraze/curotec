<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useBoardDetailsStore } from '@/stores/boardDetailsStore'
import { storeToRefs } from 'pinia'

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
    <div class="board-view">
        <div v-if="loading">Loading...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else-if="board" class="board-content">
            <h1>{{ board.name }}</h1>
            <p>{{ board.description }}</p>
            
            <div class="board-info">
                <p>Created by: {{ board.created_by }}</p>
                <p>Created at: {{ board.created_at }}</p>
            </div>

            <div class="tasks-container">
                <div v-for="status in board.task_status" :key="status.id" class="status-column">
                    <h3>Status {{ status.task_status_id }}</h3>
                    <div class="tasks">
                        <div v-for="task in board.tasks.filter(t => t.task_status_id === status.task_status_id)" 
                             :key="task.id" 
                             class="task-card">
                            <h4>{{ task.title }}</h4>
                            <p>{{ task.description }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.board-view {
    padding: 20px;
}

.error {
    color: red;
}

.tasks-container {
    display: flex;
    gap: 20px;
    margin-top: 20px;
}

.status-column {
    flex: 1;
    min-width: 250px;
}

.task-card {
    border: 1px solid #ddd;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 4px;
}
</style> 