<template>
  <div class="product-list">
    <!-- แสดงรายการ product -->
    <div class="search">
      <div class="search-block">
        <input
          v-model="search"
          placeholder="ค้นหาสินค้า"
          @input="deBounceSearch(search, selectCatalog, selectUnit, itemPerPage, createdAt)"
        />
      </div>
      <div class="catalog-block" v-if="allCatalog">
        <select
          v-model="selectCatalog"
          @change="deBounceSearch(search, selectCatalog, selectUnit, itemPerPage, createdAt)"
          style="cursor: pointer"
        >
          <option value="" selected>--หมวดหมู่--</option>
          <option v-for="c in allCatalog" :key="c._id" :value="c._id">{{ c.catalogName }}</option>
        </select>
      </div>
      <div class="unit-block" v-if="allUnit">
        <select
          v-model="selectUnit"
          @change="deBounceSearch(search, selectCatalog, selectUnit, itemPerPage, createdAt)"
          style="cursor: pointer"
        >
          <option value="" selected>--หน่วย--</option>
          <option v-for="u in allUnit" :key="u._id" :value="u._id">{{ u.unitname }}</option>
        </select>
      </div>
      <div class="favorite">
        <input
          type="checkbox"
          id="favorite"
          v-model="isFavorite"
          @input="deBounceSearch(search, selectCatalog, selectUnit, itemPerPage, createdAt)"
          style="cursor: pointer"
        />
        <label for="favorite">ติดดาว</label>
      </div>
      <select
        v-model="createdAt"
        @change="deBounceSearch(search, selectCatalog, selectUnit, itemPerPage, createdAt)"
        style="cursor: pointer"
      >
        <option value="true">วันที่เพิ่ม(ใหม่ที่สุด)</option>
        <option value="false">วันที่เพิ่ม(เก่าที่สุด)</option>
      </select>
      <Icon icon="material-symbols:refresh" width="30" height="30" @click="resetSearch" />
      <Icon icon="eos-icons:loading" width="24" height="24" />
    </div>
    <div v-if="product.length > 0" class="product-container">
      <div v-for="p in product" :key="p._id" class="allProduct">
        <product-list
          v-if="product"
          :info="p"
          :selected-item="selectItem"
          @selected="selectedItem(p._id)"
          @edit="editProduct"
          @delete="deleteProduct"
          class="product-list"
          @like="likeProduct"
        />
      </div>
    </div>
    <div v-else class="empty">
      <p class="empty-text">ไม่มีรายการสินค้าในขณะนี้</p>
    </div>
    <div v-if="product.length > 0" class="pagination">
      <select
        v-model="itemPerPage"
        @change="
          () => {
            deBounceSearch(search, selectCatalog, selectUnit, itemPerPage, createdAt)
            page = 1
          }
        "
        class="item-per-page-select"
      >
        <option selected value="1">1 รายการ/หน้า</option>
        <option selected value="2">2 รายการ/หน้า</option>
        <option selected value="3">3 รายการ/หน้า</option>
        <option selected value="4">4 รายการ/หน้า</option>
      </select>
      <div class="page">
        <div @click="pageChange(true)" class="page-btn-left">prev</div>
        <div class="page-number">{{ page }}/{{ maxPage }}</div>

        <div @click="pageChange(false)" class="page-btn-right">next</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useProductIDStore, useUserUIDStore } from '../stores/counter'
import { useRouter } from 'vue-router'
import productList from './product-list.vue'
import { doc, deleteDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { Icon } from '@iconify/vue'
import { useDebounceFn } from '@vueuse/core'
import productService from '@/api/product-service'
import catalogService from '@/api/catalog-service'
import unitService from '@/api/unit-service'

defineOptions({
  name: 'productZone',
})

interface Product {
  _id: string
  productname: string
  description: string
  quantity: number
  unit: string
  price: string
  catalog: string
  ownerID: string
  createThai: string
  favorite: boolean
}

interface Catalog {
  _id: string
  catalogName: string
}

interface Unit {
  _id: string
  unitname: string
}

const product = ref<Product[]>([])
const productStore = useProductIDStore()
const userStore = useUserUIDStore()
const uid = <string>userStore.currentUid
const router = useRouter()
const search = ref<string>('')

const allCatalog = ref<Catalog[]>()
const selectCatalog = ref<string>('')
const allUnit = ref<Unit[]>()
const selectUnit = ref<string>('')
const isFavorite = ref<boolean>(false)
const createdAt = ref<boolean>(true)
const itemPerPage = ref<number>(1)
const page = ref<number>(1)
const maxPage = ref<number>(0)

onMounted(() => {
  fetchProduct()
  onSearch('', '', '', itemPerPage.value, createdAt.value)
})

const fetchProduct = async () => {
  try {
    const catalogData = await catalogService.allCatalog(uid)
    allCatalog.value = catalogData.data

    const unitData = await unitService.allUnit(uid)
    allUnit.value = unitData.data
  } catch (error) {
    console.log(error)
  }
}

const deBounceSearch = useDebounceFn(
  (
    search: string,
    selectCatalog: string,
    selectUnit: string,
    itemPerPage: number,
    createdAtASC,
  ) => {
    onSearch(search, selectCatalog, selectUnit, itemPerPage, createdAtASC)
    console.log(createdAtASC)
  },
  500,
)

const onSearch = async (
  search: string,
  selectCatalog: string,
  selectUnit: string,
  itemPerPage: number,
  createdAtASC: boolean,
) => {
  try {
    console.log('ID', uid)
    //uid,favorite,skip
    const skip: number = itemPerPage * (page.value - 1)
    const result = await productService.searchProduct(
      search,
      selectCatalog,
      selectUnit,
      itemPerPage,
      createdAtASC,
      uid,
      isFavorite.value,
      skip,
    )
    product.value = result.data.data
    maxPage.value = Math.ceil(result.data.count / itemPerPage)
    console.log(product.value)
  } catch (error) {
    console.log('searchError', error)
  }
}

const resetSearch = () => {
  search.value = ''
  selectCatalog.value = ''
  selectUnit.value = ''
  selectItem.value = ''
  isFavorite.value = false
  createdAt.value = true
  deBounceSearch('', '', '', itemPerPage.value, createdAt.value)
}

const selectItem = ref<string>()

const selectedItem = (product: string) => {
  if (selectItem?.value && selectItem.value === product) {
    selectItem.value = '' // ปิดรายละเอียด
  } else {
    selectItem.value = product // เปิดรายละเอียด
  }
}

const editProduct = (product: string) => {
  productStore.setProductID(product)
  router.push(`/editProduct/${product}`)
}

const deleteProduct = async (product: string) => {
  try {
    await productService.deleteProduct(product)

    await deleteDoc(doc(db, 'ProductPic', product))
    onSearch(
      search.value,
      selectCatalog.value,
      selectUnit.value,
      itemPerPage.value,
      createdAt.value,
    )
  } catch (error) {
    console.log(error)
    alert('ลบไม่สำเร็จ')
  }
}

const likeProduct = async (productID: string) => {
  try {
    await productService.likeProduct(productID)
    onSearch(
      search.value,
      selectCatalog.value,
      selectUnit.value,
      itemPerPage.value,
      createdAt.value,
    )
  } catch (error) {
    alert('like error')
    console.log(error)
  }
}

const pageChange = (prev: boolean) => {
  if (prev == true && page.value > 1) {
    page.value = page.value - 1
    deBounceSearch(
      search.value,
      selectCatalog.value,
      selectUnit.value,
      itemPerPage.value,
      createdAt.value,
    )
  } else if (prev == false && page.value < maxPage.value) {
    page.value = page.value + 1
    deBounceSearch(
      search.value,
      selectCatalog.value,
      selectUnit.value,
      itemPerPage.value,
      createdAt.value,
    )
  }
}
</script>

<style scoped>
.product-list {
  display: flex;
  flex-direction: column;
  /* background-color: rgb(211, 230, 233); */
}

.product-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  grid-auto-flow: dense;
  overflow-x: auto;
  overflow-y: auto;
  gap: 10px;
  margin: 1vw;
  /* width: fit-content; */
  max-height: 100%;
}

@media (max-width: 1200px) {
  .product-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

.empty {
  display: grid;
  place-items: center;
  height: 85vh;
}

.empty-text {
  font-size: 30px;
  opacity: 0.5;
}

.allProduct {
  display: flex;
  flex-direction: column;
  /* background-color: rgb(166, 162, 162); */
  /* border: 1px solid black; */
}

.name {
  margin: 3px;
}

.search {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 15px;
  margin-top: 15px;
  gap: 20px;
  /* justify-content: center; */
}

.search-block {
  display: flex;
}

.favorite {
  display: flex;
  align-items: center;
}

.pagination {
  display: flex;
  flex-direction: row;
  gap: 2vw;
  padding: 1vw;
}

.page {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2vh;
  border: 2px solid black;
  border-radius: 2vw;
  background-color: antiquewhite;
}

.page-btn-left {
  cursor: pointer;
  border-top-left-radius: 2vw;
  border-bottom-left-radius: 2vw;
  padding: 2vh;
  padding-inline: 3vh;
}

.page-btn-left:active {
  background-color: rgb(250, 229, 201);
}

.page-btn-right {
  cursor: pointer;
  border-top-right-radius: 2vw;
  border-bottom-right-radius: 2vw;
  padding: 2vh;
  padding-inline: 3vh;
}

.page-btn-right:active {
  background-color: rgb(250, 229, 201);
}

.item-per-page-select {
  cursor: pointer;
  border-radius: 5px;
  padding-inline: 10px;
}
</style>
