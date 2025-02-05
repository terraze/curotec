import './bootstrap';
// Basic imports
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import useAuth from './stores/authStore'

import axios from 'axios'

// Layout imports
import PrimeVue from 'primevue/config'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import Message from 'primevue/message'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ConfirmDialog from 'primevue/confirmdialog'
import ConfirmationService from 'primevue/confirmationservice'
import Lara from '@primevue/themes/lara'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import '@mdi/font/css/materialdesignicons.css'
import ToastService from 'primevue/toastservice'
import Toast from 'primevue/toast'
import Password from 'primevue/password'

const pinia = createPinia()
const app = createApp(App)

// Initialize PrimeVue and its services first
app.use(PrimeVue, {
    unstyled: false,
    theme: {
        preset: Lara
    }
})
app.use(ToastService)
app.use(ConfirmationService)

// Use Pinia before any store might be accessed
app.use(pinia)

// Then other plugins
app.use(router)

// PrimeVue components
app.component('Card', Card)
app.component('Button', Button)
app.component('Divider', Divider)
app.component('Message', Message)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('ConfirmDialog', ConfirmDialog)
app.component('Dialog', Dialog)
app.component('InputText', InputText)
app.component('Textarea', Textarea)
app.component('Dropdown', Dropdown)
app.component('Toast', Toast)
app.component('Password', Password)

// Set axios defaults
axios.defaults.baseURL = '/api'
axios.defaults.withCredentials = true; // Enable cookies

// Check authentication state before mounting
const auth = useAuth()
auth.attempt().then(() => {
    app.mount('#app')
}) 