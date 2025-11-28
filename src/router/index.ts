import { createRouter, createWebHistory } from 'vue-router'
import productList from '@/view/product-list.vue'
import addProduct from '@/view/add-product.vue'
import addCatalog from '@/view/add-catalog.vue'
import editProduct from '@/view/edit-product.vue'
import login from '@/view/login.vue'
import register from '@/view/register.vue'


const routes = [
  { path: '/', name: 'productList', component: productList },
  { path: '/productList', name: 'productList', component: productList },
  { path: '/addProduct', name: 'addProduct', component: addProduct },
  { path: '/addCatalog', name: 'addCatalog', component: addCatalog },
  { path: '/editProduct', name: 'editProduct', component: editProduct },
  { path: '/loginForm', name: 'loginForm', component: login },
  { path: '/registerForm', name: 'registerForm', component: register },
  { path: '/:catchAll(.*)', component: productList },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
