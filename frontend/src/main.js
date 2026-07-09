import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import Home from './views/Home.vue'
import CityView from './views/CityView.vue'
import { vReveal } from './directives/reveal.js'
import './style.css'

// 使用 hash 模式：无需 Django 额外配置即可支持城市子页面
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/city/:slug', name: 'city', component: CityView },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

createApp(App).use(router).directive('reveal', vReveal).mount('#app')
