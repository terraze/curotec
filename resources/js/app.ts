// Basic imports
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

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

const pinia = createPinia()
const app = createApp(App)

// Use Pinia before any store might be accessed
app.use(pinia)

// Then other plugins
app.use(router)
app.use(PrimeVue, {
    unstyled: false,
    theme: {
        preset: Lara
    }
})

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
// PrimeVue services
app.use(ConfirmationService)

// Mount app
app.mount('#app') 