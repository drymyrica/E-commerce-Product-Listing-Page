<template>
  <div class="product-card">
    <div class="img-box">
      <img :src="product.image" class="product-img" />

      <div class="tag hot" v-if="product.sold > 500">热卖</div>
      <div class="tag new" v-else-if="product.id % 3 === 0">新品</div>

      <div class="fav-btn">
        <el-icon><i class="el-icon-star-off" /></el-icon>
      </div>
    </div>

    <div class="info">
      <div class="title">{{ product.title }}</div>

      <div class="description">{{ product.description }}</div>

      <div class="price">¥{{ product.price }}</div>

      <el-button type="primary" size="small" class="buy-btn" @click="handleAddToCart">
        <i class="el-icon-shopping-cart-full"></i> 加入购物车
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue"
import type { Product } from "../types/types"
import { ElMessage } from "element-plus"

const props = defineProps<{
  product: Product
}>()

const emits = defineEmits<{
  (e: "add-to-cart", product: Product): void
}>()

function handleAddToCart() {
  emits("add-to-cart", props.product)
  ElMessage.success(`${props.product.title} 已加入购物车`)
}
</script>

<style scoped>
.product-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #eee;
  transition: 0.25s;
  cursor: pointer;
}

.product-card:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.img-box {
  position: relative;
  width: 100%;
  height: 240px;
  overflow: hidden;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.tag {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 4px 10px;
  border-radius: 6px;
  color: white;
  font-size: 12px;
  font-weight: 600;
}

.tag.hot {
  background: #ff4949;
}

.tag.new {
  background: #67c23a;
}

.fav-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.info {
  padding: 14px;
}

.title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 6px;
  height: 40px;
  overflow: hidden;
}

.category {
  font-size: 13px;
  color: #999;
  margin-bottom: 4px;
}

.description {
  font-size: 13px;
  color: #666;
  height: 36px;
  overflow: hidden;
  margin-bottom: 6px;
}

.stars {
  font-size: 14px;
  color: #ff9900;
  margin-bottom: 4px;
}

.sold {
  color: #666;
  font-size: 12px;
}

.price {
  font-size: 20px;
  color: #ff4d4f;
  font-weight: 700;
  margin: 10px 0;
}

.buy-btn {
  width: 100%;
}
</style>
