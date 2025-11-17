import { createRouter, createWebHistory } from 'vue-router'
import productZone from '@/view/product-zone.vue'
import addProduct from '@/view/add-product.vue'

// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes: [],
// })

const routes = [
  { path: '/', name: 'productZone', component: productZone },
  { path: '/addProduct', name: 'addProduct', component: addProduct },
  { path: '/:catchAll(.*)', component: productZone },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
