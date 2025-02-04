import { defineStore } from 'pinia'
import axios from 'axios'
import { ApiError } from '@/types/errors/ApiError'

interface Board {
  id: number
  name: string
  description: string
  created_by: number
  created_at: string
  updated_at: string
}

interface ApiResponse {
  status: string
  data: Board[]
}

interface BoardsState {
  boards: Board[]
  loading: boolean
  error: string | null
}

export const useBoardsStore = defineStore('boards', {
  state: (): BoardsState => ({
    boards: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchBoards() {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.get<ApiResponse>('/api/boards')
        if(response.data.status !== ApiError.SUCCESS_STATUS){
            throw new ApiError(response.data.status)
        }

        this.boards = response.data.data
        
      } catch (err) {
        if (err instanceof ApiError) {
            this.error = err.message
        } else {
            this.error = 'Failed to fetch boards'
        }
        console.error('Error fetching boards:', err)
      } finally {
        this.loading = false
      }
    },

    async deleteBoard(boardId: number) {
      try {
        await axios.delete(`/api/boards/${boardId}`)
        // Remove the board from the local state
        this.boards = this.boards.filter(board => board.id !== boardId)
      } catch (error) {
        this.error = 'Failed to delete board'
        console.error('Error deleting board:', error)
      }
    }
  }
}) 