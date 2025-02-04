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
  data: Board
}

interface BoardDetailsState {
  board: Board | null
  loading: boolean
  error: string | null
}

export const useBoardDetailsStore = defineStore('boardDetails', {
  state: (): BoardDetailsState => ({
    board: null,
    loading: false,
    error: null
  }),

  actions: {
    async fetchBoard(id: number) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.get<ApiResponse>(`/api/boards/${id}`)
        if (response.data.status !== ApiError.SUCCESS_STATUS) {
          throw new ApiError(response.data.status)
        }

        this.board = response.data.data
        
      } catch (err) {
        if (err instanceof ApiError) {
          this.error = err.message
        } else {
          this.error = 'Failed to load board'
        }
        console.error('Error loading board:', err)
      } finally {
        this.loading = false
      }
    },

    reset() {
      this.board = null
      this.error = null
      this.loading = false
    }
  }
}) 