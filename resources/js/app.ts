import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import '@mdi/font/css/materialdesignicons.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app') 