<template>
  <div class="product-list">
    <div v-if="info" @click="onClick(info._id)" class="product-title">
      <!-- <div>{{ info._id }}</div> -->
      <div class="product-name">{{ info.productname }}</div>
      <img v-if="picURL" :src="picURL" alt="Product Image" class="product-image" />
    </div>
    <div v-if="selectedItem == info._id" class="productDetails">
      <h3>รายละเอียดสินค้า:</h3>
      <p class="name">{{ info.description }}</p>
      <h3>จำนวนสินค้า:</h3>
      <p class="name">{{ info.quantity }}</p>
      <h3>หน่วย:</h3>
      <p class="name">{{ info.unit }}</p>
      <h3>ราคาสินค้า:</h3>
      <p class="name">{{ info.price }}</p>
      <h3>หมวดหมู่:</h3>
      <p class="name">{{ info.catalog }}</p>
      <h3>เจ้าของสินค้า:</h3>
      <p class="name">{{ info.ownerID }}</p>
      <div class="button-zone">
        <button class="edit-button" @click="editProduct(info._id)">แก้ไข</button>
        <button class="delete-button" @click="deleteProduct(info._id)">ลบสินค้า</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onMounted, ref } from 'vue';

defineOptions({
  name: "productList",
})

const emits = defineEmits(['selected', 'edit', 'delete']);

const props = defineProps({
  info: {
    type: Object,
    required: true,
    default: () => ({ _id: '' })
  },
  selectedItem: String,
})

const picURL = ref<string>()

onMounted(async () => {

  const pictureRef = doc(db, "ProductPic", props.info._id || '');
  const picSnap = await getDoc(pictureRef);

  if (picSnap.exists()) {
    picURL.value = picSnap.data().path.base64;
    console.log(picURL)
  } else {
    console.log('no img')
  }
})

const onClick = (_id: string) => {
  console.log('selected', _id, props.info._id)
  emits('selected', _id)
}

const editProduct = (productID: string) => {
  emits('edit', productID)
}

const deleteProduct = (productID: string) => {
  emits('delete', productID);
}
</script>

<style scoped>
.product-list {
  cursor: pointer;
  user-select: none;
  display: flex;
  flex-direction: column;
  border-radius: 1vh;
  background-color: #ffebcd;
  border: 0.5px solid black;
  /* width: fit-content; */
}

.product-image {
  height: 30vh;
  object-fit: contain;
}

.product-name {
  font-weight: bold;
  font-size: 25px;
  margin-bottom: 2vh;
}

.edit-button {
  margin: 5px;
  width: fit-content;
  padding-block: 3px;
}

.delete-button {
  margin: 5px;
  width: fit-content;
  padding-block: 3px;
}

.delete-button:hover {
  background-color: rgb(197, 35, 35);
  color: aliceblue;
}

.button-zone {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.product-title {
  padding: 2vh;
}

.productDetails {
  background-color: #f0ddbf;
  padding: 2vh;
}

h3 {
  font-weight: bolder;
}
</style>
