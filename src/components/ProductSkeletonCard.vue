<template>
  <div class="product-card skeleton-card">
    <div class="img-box skeleton-img"></div>
    <div class="info">
      <div class="title skeleton-title"></div>
      <div class="stars skeleton-stars"></div>
      <div class="price skeleton-price"></div>
      <div class="buy-btn skeleton-btn"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.product-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #eee;
}

.skeleton-card {
  background: #f5f5f5;
  animation: pulse 1.5s infinite;
}

.skeleton-img {
  width: 100%;
  height: 240px;
  background: #e0e0e0;
}

.skeleton-title {
  width: 80%;
  height: 20px;
  margin: 10px 0 6px;
  background: #e0e0e0;
  border-radius: 4px;
}

.skeleton-stars {
  width: 60%;
  height: 14px;
  background: #e0e0e0;
  border-radius: 4px;
  margin-bottom: 4px;
}

.skeleton-price {
  width: 40%;
  height: 20px;
  background: #e0e0e0;
  border-radius: 4px;
  margin: 10px 0;
}

.skeleton-btn {
  width: 100%;
  height: 32px;
  background: #e0e0e0;
  border-radius: 6px;
}

@keyframes pulse {
  0% { background-color: #f5f5f5; }
  50% { background-color: #eaeaea; }
  100% { background-color: #f5f5f5; }
}
</style>
