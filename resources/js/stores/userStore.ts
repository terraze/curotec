import { defineStore } from 'pinia';
import type { User } from '@/types/user';
import axios from 'axios';

interface UserState {
  users: User[];
  loaded: boolean;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    users: [],
    loaded: false
  }),

  actions: {
    async fetchUsers() {
      try {
        const response = await axios.get<{data: User[]}>('/api/users');
        this.users = response.data.data;
        this.loaded = true;
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    },

    async updateTaskAssignee(taskId: number, assigneeId: number | null) {
      try {
        await axios.put(`/api/tasks/${taskId}/assignee`, {
          assignee_id: assigneeId
        });
      } catch (error) {
        console.error('Error updating task assignee:', error);
        throw error;
      }
    }
  }
}); 