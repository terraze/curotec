import { defineStore } from 'pinia'
import axios from 'axios'
import { ApiError } from '@/types/errors/ApiError'
import { Task } from '@/types/boardDetails'
import type { BoardDetails } from '@/types/boardDetails'
import { useLoadingStore } from '@/stores/loadingStore'

interface ApiResponse {
  status: string
  data: BoardDetails
}

interface BoardDetailsState {
  board: BoardDetails | null
  loading: boolean
  error: Error | null
}

interface NewTask {
    title: string
    description: string
    task_status_id: number
    board_id: number
}

export const useBoardDetailsStore = defineStore('boardDetails', {
  state: (): BoardDetailsState => ({
    board: null,
    loading: false,
    error: null
  }),

  actions: {
    async fetchBoardDetails(boardId: number) {
      const loadingStore = useLoadingStore()
      loadingStore.startLoading()
      
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
        loadingStore.stopLoading()
      }
    },

    async updateTaskStatus(taskId: number, newStatusId: number) {
      try {
        await axios.put(`/api/tasks/${taskId}/status`, {
          task_status_id: newStatusId
        })
        
        // Update the local state
        const taskIndex = this.board?.tasks.findIndex(t => t.id === taskId)
        if (taskIndex !== undefined && taskIndex !== -1 && this.board) {
          this.board.tasks[taskIndex].task_status_id = newStatusId
        }
      } catch (error) {
        throw error
      }
    },

    reset() {
      this.board = null
      this.error = null
      this.loading = false
    },

    async createTask(taskData: NewTask) {
      const loadingStore = useLoadingStore()
      loadingStore.startLoading()
      
      try {
        const response = await axios.post<{status: string, data: Task}>('/api/tasks', taskData)
        
        if(response.data.status !== ApiError.SUCCESS_STATUS){
          throw new ApiError(response.data.status)
        }

        // Add the new task to the local state
        if (this.board) {
          this.board.tasks.push(response.data.data)
        }
        
        return response.data.data
      } catch (error) {
        if (error instanceof ApiError) {
          this.error = new Error(error.message)
        } else {
          this.error = new Error('Failed to create task')
        }
        console.error('Error creating task:', error)
        throw error
      } finally {
        loadingStore.stopLoading()
      }
    },

    async deleteTask(taskId: number) {
      const loadingStore = useLoadingStore()
      loadingStore.startLoading()
      
      try {
        const response = await axios.delete<{status: string}>(`/api/tasks/${taskId}`)

        // Remove the task from the local state
        if (this.board) {
          this.board.tasks = this.board.tasks.filter(task => task.id !== taskId)
        }
      } catch (error) {
        if (error instanceof ApiError) {
          this.error = new Error(error.message)
        } else {
          this.error = new Error('Failed to delete task')
        }
        console.error('Error deleting task:', error)
        throw error
      } finally {
        loadingStore.stopLoading()
      }
    },

    async updateTaskAssignee(taskId: number, assigneeId: number | null) {
      const loadingStore = useLoadingStore()
      loadingStore.startLoading()
      try {
        await axios.put(`/api/tasks/${taskId}/assignee`, { assignee_id: assigneeId });
        await this.fetchBoardDetails(this.board!.id);
      } catch (error) {
        console.error('Failed to update task assignee:', error);
        throw error;
      } finally {
        loadingStore.stopLoading()
      }
    }
  }
}) 