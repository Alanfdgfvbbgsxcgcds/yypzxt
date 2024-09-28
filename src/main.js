import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import vant from './utils/vant'
import router from './router/index'
const app = createApp(App)
app.use(vant)

router.beforeEach((to, from) => {
  if (to.path !== '/login') {
    if (!localStorage.getItem('h5_token')) {
      return '/login'
    }
  }
})


app.use(router) //挂载路由
app.mount('#app')
