import { defineStore } from 'pinia'
import axios from 'axios'
import { ApiError } from '@/types/errors/ApiError'
import type { BoardDetails } from '@/types/boardDetails'

interface ApiResponse {
  status: string
  data: BoardDetails
}

interface BoardDetailsState {
  board: BoardDetails | null
  loading: boolean
  error: Error | null
}

export const useBoardDetailsStore = defineStore('boardDetails', {
  state: (): BoardDetailsState => ({
    board: null,
    loading: false,
    error: null
  }),

  actions: {
    async fetchBoardDetails(boardId: number) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.get<ApiResponse>(`/api/boards/${boardId}`)
        if (response.data.status !== ApiError.SUCCESS_STATUS) {
          throw new ApiError(response.data.status)
        }

        this.board = response.data.data
        
      } catch (err) {
        if (err instanceof ApiError) {
          this.error = err as Error
        } else {
          this.error = new Error('Failed to load board')
        }
        console.error('Error loading board:', err)
      } finally {
        this.loading = false
      }
    },

    async updateTaskStatus(taskId: number, newStatusId: number) {
      try {
        await axios.patch(`/api/tasks/${taskId}`, {
          task_status_id: newStatusId
        })
        // Refresh board details after update
        if (this.board) {
          await this.fetchBoardDetails(this.board.id)
        }
      } catch (error) {
        this.error = error as Error
        throw error
      }
    },

    reset() {
      this.board = null
      this.error = null
      this.loading = false
    }
  }
}) 