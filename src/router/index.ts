import { createRouter, createWebHistory } from 'vue-router'
import productZone from '@/view/product-zone.vue'
import addProduct from '@/view/add-product.vue'
import addCatalog from '@/view/add-catalog.vue'
import editProduct from '@/view/edit-product.vue'
import login from '@/components/login.vue'
import register from '@/components/register.vue'

// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes: [],
// })

const routes = [
  { path: '/', name: 'productZone', component: productZone },
  { path: '/productZone', name: 'productZone', component: productZone },
  { path: '/addProduct', name: 'addProduct', component: addProduct },
  { path: '/addCatalog', name: 'addCatalog', component: addCatalog },
  { path: '/editProduct', name: 'editProduct', component: editProduct },
  { path: '/loginForm', name: 'loginForm', component: login },
  { path: '/registerForm', name: 'registerForm', component: register },
  { path: '/:catchAll(.*)', component: productZone },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
