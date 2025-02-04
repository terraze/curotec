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
import Lara from '@primevue/themes/lara'
import '@mdi/font/css/materialdesignicons.css'

// App
const app = createApp(App)
app.use(createPinia())
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

// Mount app
app.mount('#app') 