<template>
  <div class="product-list">
    <div v-if="info" @click="onClick(info._id)" class="product-title">
      <!-- <div>{{ info._id }}</div> -->
      <div class="product-name">{{ info.productname }}</div>
      <!-- <div class="product-name">{{ info.favorite }}</div> -->
      <img v-if="picURL" :src="picURL" alt="Product Image" class="product-image" />
    </div>
    <div v-if="selectedItem == info._id" class="productDetails">
      <h3>รายละเอียดสินค้า:</h3>
      <p class="name">{{ info.description }}</p>
      <h3>จำนวนสินค้า:</h3>
      <div class="quantity-block">
        <p class="name">{{ info.quantity }}</p>
        <p v-if="info.quantity <= 5" class="quantity-warning">สินค้าใกล้จะหมดแล้ว!!</p>
      </div>
      <h3>หน่วย:</h3>
      <p class="name">{{ info.unit.unitname }}</p>
      <h3>ราคาสินค้า:</h3>
      <p class="name">{{ info.price }}</p>
      <h3>หมวดหมู่:</h3>
      <p class="name">{{ info.catalog.catalogName }}</p>
      <h3>วัน เวลาที่สร้าง:</h3>
      <p class="name">{{ info.createThai }}</p>
      <div class="button-zone">
        <button class="edit-button" @click="editProduct(info._id)">แก้ไข</button>
        <Icon icon="material-symbols:delete-outline-rounded" width="30px" height="30px" color="#C20506"
          @click="deleteProduct(info._id)" class="delete-button" />
      </div>
    </div>
    <div class="product-status">
      <Transition name="fade" mode="out-in">
        <Icon v-if="info.favorite == false" key="false" icon="material-symbols:kid-star-outline-sharp" width="30"
          height="30" style="margin: 2vh; margin-block-start: 3vh;" @click="onLike(info._id)" />
        <Icon v-else key="true" icon="material-symbols:kid-star-sharp" width="30" height="30"
          style="color: #ebf304; stroke: black; stroke-width: 2px; margin: 2vh; margin-block-start: 3vh;"
          @click="onLike(info._id)" />
      </Transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onMounted, ref } from 'vue';
import { Icon } from '@iconify/vue';

defineOptions({
  name: "productList",
})

const emits = defineEmits(['selected', 'edit', 'delete', 'like']);

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
    // console.log(picURL)
  } else {
    console.log('no img')
  }

  console.log(props)
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

const onLike = (productID: string) => {
  emits('like', productID)
}
</script>

<style scoped>
.product-list {
  user-select: none;
  display: flex;
  flex-direction: column;
  border-radius: 1vh;
  margin: 0.5vw;
  background-color: #ffebcd;
  transition: all 0.3s ease-in-out;
  max-width: 100%;
  max-height: 100%;
}

.product-list:hover {
  box-shadow: 5px 5px 5px gray;
  transform: scale(1);
}

.product-image {
  display: flex;
  flex-direction: column;
  height: 20vh;
  width: 15vw;
  object-fit: contain;
  transition: all 0.3s ease;
}

.product-image:active{
  height: 30vh;
  width: 20vw;
}

.product-name {
  font-weight: bold;
  font-size: 30px;
  margin-bottom: 2vh;
}

.edit-button {
  margin: 5px;
  width: fit-content;
  font-size: 15;
  padding: 9px;
  padding-inline: 1.5vw;
  border-radius: 1vh;
  border-width: 0px;
  transition: all;
  cursor: pointer;
}

.edit-button:active {
  background-color: #b1b0b0;
  color: #ebe8e8;
  transform: translateY(4px);
}

.delete-button {
  cursor: pointer;
}

.button-zone {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.product-title {
  display: flex;
  flex-direction: column;
  padding: 2vh;
  text-align: left;
  justify-content: center;
  cursor: pointer;
}

.productDetails {
  background-color: #f0ddbf;
  padding: 2vh;
  /* max-width: 80vw; */
  max-height: 80vh;
  border-bottom-right-radius: 1vh;
  border-bottom-left-radius: 1vh;
}

h3 {
  font-weight: bolder;
  margin-block: 1vw;
  font-size: 22px;
}

.name {
  font-size: 18px;
}

p {
  margin-block: 3px;
  /* margin-bottom: 15px; */
}

.quantity-warning {
  color: crimson;
  font-size: 2vh;
  align-self: center;
}

.quantity-block {
  display: flex;
  flex-direction: row;
  gap: 1vw;
  align-self: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.product-status {
  background-color: #fff2dd;
  cursor: pointer;
}
</style>
