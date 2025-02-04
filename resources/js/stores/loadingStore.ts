import { defineStore } from 'pinia';

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    isLoading: false,
    loadingCount: 0
  }),

  actions: {
    startLoading() {
      this.loadingCount++;
      this.isLoading = true;
    },

    stopLoading() {
      this.loadingCount--;
      if (this.loadingCount <= 0) {
        this.loadingCount = 0;
        this.isLoading = false;
      }
    }
  }
}); 