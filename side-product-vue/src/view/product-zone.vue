<template>
  <div class="product-list">
    <!-- แสดงรายการ product -->
    <div class="search">
      <div class="search-block">
        <input v-model="search" placeholder="ค้นหาสินค้า"
          @input="deBounceSearch(search, selectCatalog, selectUnit, createdAt, itemPerPage)" />
        <!-- <Icon icon="material-symbols:search" width="24" height="24" /> -->
      </div>
      <div class="catalog-block" v-if="allCatalog">
        <select v-model="selectCatalog"
          @change="deBounceSearch(search, selectCatalog, selectUnit, createdAt, itemPerPage)">
          <option value="" selected>--หมวดหมู่--</option>
          <option v-for="c in allCatalog" :key="c._id" :value="c._id">{{ c.catalogName }}</option>
        </select>
      </div>
      <div class="unit-block" v-if="allUnit">
        <select v-model="selectUnit"
          @change="deBounceSearch(search, selectCatalog, selectUnit, createdAt, itemPerPage)">
          <option value="" selected>--หน่วย--</option>
          <option v-for="u in allUnit" :key="u._id" :value="u._id">{{ u.unitname }}</option>
        </select>
      </div>
      <div class="favorite">
        <input type="checkbox" id="favorite" v-model="isFavorite"
          @input="deBounceSearch(search, selectCatalog, selectUnit, createdAt, itemPerPage)" />
        <label for="favorite">ติดดาว</label>
      </div>
      <select v-model="createdAt" @change="console.log(createdAt)">
        <option :value="true" selected>วันที่เพิ่ม(ใหม่ที่สุด)</option>
        <option :value="false">วันที่เพิ่ม(เก่าที่สุด)</option>
      </select>
      <Icon icon="material-symbols:refresh" width="30" height="30" @click="resetSearch" />
    </div>
    <div v-if="product.length > 0" class="product-container">
      <div v-for="p in product" :key="p._id" class="allProduct">
        <product-list v-if="product" :info="p" :selected-item="selectItem" @selected="selectedItem(p._id)"
          @edit="editProduct" @delete="deleteProduct" class="product-list" @like="likeProduct" />
      </div>
    </div>
    <div v-else class="empty">
      <p class="empty-text">ไม่มีรายการสินค้าในขณะนี้</p>
    </div>
    <div v-if="product.length > 0">
      <select v-model="itemPerPage"
        @change="deBounceSearch(search, selectCatalog, selectUnit, createdAt, itemPerPage)">
        <option selected value="1">1 รายการ/หน้า</option>
        <option selected value="2">2 รายการ/หน้า</option>
        <option selected value="3">3 รายการ/หน้า</option>
        <option selected value="4">4 รายการ/หน้า</option>
      </select>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useProductIDStore, useUserUIDStore } from '../stores/counter'
import { useRouter } from 'vue-router'
import productList from './product-list.vue'
import { doc, deleteDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { Icon } from '@iconify/vue'
import { useDebounceFn } from '@vueuse/core'
// import { useDebounceFn,useEventListener } from '@vueuse/core'

defineOptions({
  name: 'productZone',
})

interface Product {
  _id: string;
  productname: string;
  description: string;
  quantity: number;
  unit: string;
  price: string;
  catalog: string;
  ownerID: string;
  createThai: string;
  favorite: boolean;
}

interface Catalog {
  _id: string;
  catalogName: string;
}

interface Unit {
  _id: string;
  unitname: string;
}

const URL = import.meta.env.VITE_API_BASE_URL
const product = ref<Product[]>([])
const productStore = useProductIDStore()
const userStore = useUserUIDStore();
const uid = userStore.currentUid
const router = useRouter()
const search = ref<string>('')

const allCatalog = ref<Catalog[]>()
const selectCatalog = ref<string>('')
const allUnit = ref<Unit[]>()
const selectUnit = ref<string>('')
const isFavorite = ref<boolean>(false);
const createdAt = ref<boolean>(true);
const itemPerPage = ref<number>(1)

onMounted(() => {
  fetchProduct()
  // fetchUser()
  onSearch('', '', '', createdAt.value,itemPerPage.value);
})

const fetchProduct = async () => {
  try {
    //fetch product ทั้งหมดออกมา
    // console.log('url', URL)
    // const productfetch = await axios.get(`${URL}/product/all/${uid}`)
    // console.log(productfetch)

    // product.value = productfetch.data

    const catalogData = await axios.get(`${URL}/catalog/${uid}`)
    allCatalog.value = catalogData.data;

    const unitData = await axios.get(`${URL}/unit/${uid}`)
    allUnit.value = unitData.data;
  } catch (error) {
    console.log(error)
  }
}

const deBounceSearch = useDebounceFn((search: string, selectCatalog: string, selectUnit: string, createdAtASC: boolean, itemPerPage: number) => {
  onSearch(search, selectCatalog, selectUnit, createdAtASC,itemPerPage)
}, 500)

const onSearch = async (search: string, selectCatalog: string, selectUnit: string, createdAtASC: boolean, itemPerPage: number) => {
  try {
    console.log('ID', uid)
    if (isFavorite.value == true) {
      console.log('fav');
      const result = await axios.get(`${URL}/product/search?productname=${search}&catalog=${selectCatalog}&unit=${selectUnit}&ownerID=${uid}&favorite=${isFavorite.value}&createdAtASC=${createdAtASC}&limit=${itemPerPage}`);
      product.value = result.data;
    } else {
      const result = await axios.get(`${URL}/product/search?productname=${search}&catalog=${selectCatalog}&unit=${selectUnit}&ownerID=${uid}&createdAtASC=${createdAtASC}&limit=${itemPerPage}`);
      product.value = result.data;
    }


    console.log(product.value)
  } catch (error) {
    console.log('searchError', error);
  }
}

const resetSearch = () => {
  search.value = '';
  selectCatalog.value = '';
  selectUnit.value = '';
  selectItem.value = ''
  isFavorite.value = false;
  createdAt.value = (true)
  onSearch('', '', '', createdAt.value,itemPerPage.value);
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
  router.push('/editProduct')
}

const deleteProduct = async (product: string) => {
  try {
    await axios.delete(`${URL}/product/${product}`);

    await deleteDoc(doc(db, "ProductPic", product))
    fetchProduct();
  } catch (error) {
    console.log(error);
    alert('ลบไม่สำเร็จ');
  }
}

const likeProduct = async (productID: string) => {
  try {
    await axios.patch(`${URL}/product/favorite/${productID}`);
    onSearch(search.value, selectCatalog.value, selectUnit.value, createdAt.value,itemPerPage.value)
  } catch (error) {
    alert('like error');
    console.log(error);
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
</style>
