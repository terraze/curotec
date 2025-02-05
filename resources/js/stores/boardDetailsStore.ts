import { defineStore } from 'pinia'
import axios from 'axios'
import { ApiError } from '@/types/errors/ApiError'
import { Task } from '@/types/boardDetails'
import type { BoardDetails } from '@/types/boardDetails'
import { useLoadingStore } from '@/stores/loadingStore'
import type { ApiResponse } from '@/types/api'

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

// Reusable function to handle concurrent updates with a optimistic lock based on updated_at
const handleOptimisticUpdate = async (
  operation: () => Promise<any>,
  taskId: number,
  board: BoardDetails | null,
  toast: any
) => {
  try {
    const response = await operation();
    // Update local state with the new data from server
    if (board) {
      const taskIndex = board.tasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        board.tasks[taskIndex] = response.data.data;
      }
    }
  } catch (error: any) {
    // Handle 404 Not Found (task was deleted)
    if (error.response?.status === 404) {
      toast.add({
        severity: 'error',
        summary: 'Task Not Found',
        detail: 'This task has been deleted by another user.',
        life: 10000
      });
      // Remove the task from local state
      if (board?.tasks) {
        board.tasks = board.tasks?.filter(t => t?.id !== taskId);
      }
      return;
    }

    // Handle concurrent modification
    if (error.response?.data?.code === 'STALE_OBJECT') {
      toast.add({
        severity: 'warn',
        summary: 'Update Conflict',
        detail: 'This task has been modified by another user.',
        life: 10000
      });
      // Update local state with server data
      if (board) {
        const taskIndex = board.tasks.findIndex(t => t.id === error.response.data.data.id);
        if (taskIndex !== -1) {
          board.tasks[taskIndex] = error.response.data.data;
        }
      }
    }
    throw error;
  }
};

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
        const response = await axios.get<ApiResponse<BoardDetails>>(`/boards/${boardId}`)
        if (response.data.status !== "success") {
          throw new ApiError('Failed to load board')
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

    async updateTaskStatus(taskId: number, newStatusId: number, toast: any) {
      const task = this.board?.tasks.find(t => t.id === taskId);
      if (!task) throw new Error('Task not found');

      await handleOptimisticUpdate(
        () => axios.put(`/tasks/${taskId}/status`, {
          task_status_id: newStatusId
        }),
        taskId,
        this.board,
        toast
      );
    },

    reset() {
      this.board = null
      this.error = null
      this.loading = false
    },

    async createTask(taskData: Partial<Task>): Promise<void> {
      const loadingStore = useLoadingStore()
      loadingStore.startLoading()

      try {
        const response = await axios.post('/tasks', taskData)

        if (response.data.status !== ApiError.SUCCESS_STATUS) {
          throw new ApiError(response.data.status)
        }

        // We don't need to update the state since we are using websockets to update the task

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
        const response = await axios.delete<{ status: string }>(`/tasks/${taskId}`)

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

    async updateAssignee(taskId: number, assigneeId: number | null, toast: any) {
      const task = this.board?.tasks.find(t => t.id === taskId);
      if (!task) throw new Error('Task not found');

      await handleOptimisticUpdate(
        () => axios.put(`/tasks/${taskId}/assignee`, {
          assignee_id: assigneeId
        }),
        taskId,
        this.board,
        toast
      );
    }
  }
}) 