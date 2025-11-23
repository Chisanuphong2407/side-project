<template>
  <div class="allNavigator">
    <aside>
      <div class="sidebar-header">Navigator</div>
      <nav class="navigator">
        <router-link to="/" class="nav-item">สินค้าทั้งหมด</router-link>
        <router-link to="/addCatalog" class="nav-item">เพิ่มหมวดหมู่</router-link>
        <router-link to="/addProduct" class="nav-item">เพิ่มสินค้า</router-link>
      </nav>
    </aside>
  </div>
</template>

<script lang="ts" setup>
</script>

<style scoped>
.allNavigator {
  display: flex;
  padding-inline: 1vw;
  padding-block: 2vh;
  justify-content: center;
  background-color: rgb(56, 56, 56);
  color: white;
}

.navigator {
  display: flex;
  flex-direction: column;
  margin-top: 3vh;
  text-align: center;
}

.nav-item {
  margin-block: 1vh;
  text-decoration: none;
  font-size: 2.5vh;
  color: rgb(255, 255, 255);
  transition: transform 0.3s ease;
}

.nav-item:hover {
  /* font-size: 2.9vh; */
  transform: scale(1.3);
}

.sidebar-header {
  font-weight: bold;
  font-size: 20px;
  text-align: center;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}
</style>
