import { defineStore } from 'pinia';
import axios from 'axios';

interface User {
    id: number;
    name: string;
    email: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        user: null,
        token: localStorage.getItem('token'),
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
    },

    actions: {
        async login(email: string, password: string) {
            try {
                const response = await axios.post('/api/login', {
                    email,
                    password,
                });

                this.user = response.data.user;
                this.token = response.data.token;
                localStorage.setItem('token', response.data.token);

                // Configure axios to use the token
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

                return true;
            } catch (error) {
                console.error('Login failed:', error);
                return false;
            }
        },

        async register(name: string, email: string, password: string, password_confirmation: string) {
            try {
                const response = await axios.post('/api/register', {
                    name,
                    email,
                    password,
                    password_confirmation,
                });

                this.user = response.data.user;
                this.token = response.data.token;
                localStorage.setItem('token', response.data.token);

                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

                return true;
            } catch (error) {
                console.error('Registration failed:', error);
                return false;
            }
        },

        async logout() {
            try {
                await axios.post('/api/logout');
                this.user = null;
                this.token = null;
                localStorage.removeItem('token');
                delete axios.defaults.headers.common['Authorization'];
            } catch (error) {
                console.error('Logout failed:', error);
            }
        },

        async fetchUser() {
            try {
                const response = await axios.get('/api/user');
                this.user = response.data;
            } catch (error) {
                console.error('Failed to fetch user:', error);
            }
        },
    },
}); 