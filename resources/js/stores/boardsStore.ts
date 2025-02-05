import { defineStore } from 'pinia'
import axios from 'axios'
import { ApiError } from '@/types/errors/ApiError'
import { useLoadingStore } from '@/stores/loadingStore'

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

interface NewBoard {
  name: string
  description: string
}

export const useBoardsStore = defineStore('boards', {
  state: (): BoardsState => ({
    boards: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchBoards() {
      const loadingStore = useLoadingStore()
      loadingStore.startLoading()

      try {
        const response = await axios.get<ApiResponse>('/boards')
        if (response.data.status !== ApiError.SUCCESS_STATUS) {
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
        loadingStore.stopLoading()
      }
    },

    async deleteBoard(boardId: number) {
      const loadingStore = useLoadingStore()
      loadingStore.startLoading()

      try {
        await axios.delete(`/boards/${boardId}`)
        // Remove the board from the local state
        this.boards = this.boards.filter(board => board.id !== boardId)
      } catch (error) {
        this.error = 'Failed to delete board'
        console.error('Error deleting board:', error)
      } finally {
        loadingStore.stopLoading()
      }
    },

    async createBoard(boardData: NewBoard) {
      const loadingStore = useLoadingStore()
      loadingStore.startLoading()

      try {
        const response = await axios.post<{ status: string, data: Board }>('/boards', boardData)

        if (response.data.status !== ApiError.SUCCESS_STATUS) {
          throw new ApiError(response.data.status)
        }

        // Add the new board to the local state
        this.boards.push(response.data.data)
        return response.data.data
      } catch (error) {
        if (error instanceof ApiError) {
          this.error = error.message
        } else {
          this.error = 'Failed to create board'
        }
        console.error('Error creating board:', error)
        throw error
      } finally {
        loadingStore.stopLoading()
      }
    }
  }
}) 