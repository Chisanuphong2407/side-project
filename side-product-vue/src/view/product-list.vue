<template>
  <div class="product-list">
    <div v-if="info" @click="onClick(info._id)">
      <div>{{ info._id }}</div>
      <div>{{ info.productname }}</div>
      <img v-if="picURL" :src="picURL" alt="Product Image" class="product-image" />
    </div>
    <div v-if="selectedItem == info._id" class="productDetails">
      <p class="name">{{ info.description }}</p>
      <p class="name">{{ info.quantity }}</p>
      <p class="name">{{ info.unit }}</p>
      <p class="name">{{ info.price }}</p>
      <p class="name">{{ info.catalog }}</p>
      <p class="name">{{ info.ownerID }}</p>
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

const emits = defineEmits(['selected']);

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
</script>

<style scoped>
.product-list {
  cursor: pointer;
  user-select: none;
  display: flex;
  flex-direction: column;
  padding: 2vh;
}

.product-image {
  height: 30vh;
  object-fit: contain;
}

</style>
