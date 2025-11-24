<template>
  <div class="allNavigator">
    <aside>
      <div class="sidebar-header">Navigator</div>
      <nav class="navigator">
        <div class="nav-block">
          <Icon icon="material-symbols:shopping-cart" width="24" height="24" class="icon" />
          <router-link to="/" class="nav-item">สินค้าทั้งหมด</router-link>
        </div>
        <div class="nav-block">
          <Icon icon="material-symbols:add-circle-outline-rounded" width="24" height="24" class="icon"/>
          <router-link to="/addCatalog" class="nav-item">เพิ่มหมวดหมู่</router-link>
        </div>
        <div class="nav-block">
          <Icon icon="material-symbols:add-shopping-cart-sharp" width="24" height="24" class="icon"/>
          <router-link to="/addProduct" class="nav-item">เพิ่มสินค้า</router-link>
        </div>
      </nav>
    </aside>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from '@iconify/vue';

</script>

<style scoped>
.allNavigator {
  display: flex;
  /* padding-inline: 1vw;
  padding-block: 2vh; */
  justify-content: center;
  background-color: rgb(80, 75, 69);
  color: white;
}

@media (max-width: 1200px) {
  .nav-item {
    display: none;
  }

  .sidebar-header {display: none;}
}
.navigator {
  display: flex;
  flex-direction: column;
  margin-top: 3vh;
}

.nav-item {
  text-decoration: none;
  font-size: 2.5vh;
  color: rgb(255, 255, 255);
  width: 10vw;
}

.nav-block {
  padding-block: 1vh;
  transition: all 0.3s ease;
}

.icon {
  margin-right: 1vw;
  align-self: center;
}

.nav-block:hover {
  /* font-size: 2.9vh; */
  background-color: rgb(122, 121, 120);
  transform: scale(1.3);
}

.sidebar-header {
  font-weight: bold;
  font-size: 2vw;
  margin-top: 2vh;
  text-align: center;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}
</style>
