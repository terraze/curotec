import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Board, BoardResponse } from '@/types/boardDetails'
import axios from 'axios'

export const useBoardDetailsStore = defineStore('boardDetails', () => {
    const board = ref<Board | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    async function fetchBoard(id: number) {
        try {
            loading.value = true
            error.value = null
            const response = await axios.get<BoardResponse>(`/api/boards/${id}`)
            board.value = response.data.data
        } catch (e) {
            error.value = 'Failed to load board'
            console.error('Error loading board:', e)
        } finally {
            loading.value = false
        }
    }

    function reset() {
        board.value = null
        error.value = null
        loading.value = false
    }

    return {
        board,
        loading,
        error,
        fetchBoard,
        reset
    }
}) 