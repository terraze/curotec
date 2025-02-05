import { computed, reactive, ref } from 'vue'
import axios from 'axios'
import router from '../router'

const state = reactive({
    authenticated: false,
    user: {}
})

export default function useAuth() {
    const authenticated = computed(() => state.authenticated)
    const user = computed(() => state.user)

    const setAuthenticated = (authenticated: boolean) => {
        state.authenticated = authenticated
    }

    const setUser = (user: any) => {
        state.user = user
    }

    const login = async (credentials: any) => {
        try {
            // 1. Get CSRF cookie
            await axios.get('/sanctum/csrf-cookie')

            // 2. Send login credentials
            await axios.post('/login', credentials)

            // 3. If successful, verify user session
            return attempt()
        } catch (e: any) {
            return Promise.reject(e.response.data.errors)
        }
    }

    const logout = async () => {
        try {
            await axios.post('/logout')
            setAuthenticated(false)
            setUser({})
            router.push('/login')
        } catch (error) {
            console.error('Logout error:', error)
            setAuthenticated(false)
            setUser({})
            router.push('/login')
        }
    }

    const attempt = async () => {
        try {
            // 4. Get authenticated user data
            let response = await axios.get('/user')

            // 5. Update authentication state
            setAuthenticated(true)
            setUser(response.data)

            return response
        } catch (e: any) {
            setAuthenticated(false)
            setUser({})
        }
    }

    return {
        authenticated,
        user,
        login,
        logout,
        attempt
    }
}