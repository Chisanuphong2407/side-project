<template>
  <div class="allNavigator">
    <aside>
      <div class="sidebar-header">Navigator</div>
      <nav class="navigator">
        <router-link to="/" class="nav-item">สินค้าทั้งหมด</router-link>
        <router-link to="/addProduct" class="nav-item">เพิ่มสินค้า</router-link>
      </nav>
    </aside>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
.allNavigator {
    padding-inline: 1vw;
    padding-block: 2vh;
    background-color: darkgray;
}

.navigator {
    display: flex;
    flex-direction: column;
    margin-top: 3vh;
}

.nav-item {
    margin-block: 0.7vh;
}
.sidebar-header  {
    font-weight: bold;
    font-size: large;
}
</style>