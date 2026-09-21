// Bootstrap Dependency 
import 'bootstrap/dist/css/bootstrap.min.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'

createApp(App).use(createPinia()).mount('#app')
