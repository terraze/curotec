import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import Lara from '@primevue/themes/lara'
import '@mdi/font/css/materialdesignicons.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
    unstyled: false,
    theme: {
        preset: Lara
    }
})

app.component('Card', Card)
app.component('Button', Button)
app.component('Divider', Divider)

app.mount('#app') 