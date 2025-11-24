<template>
  <div class="product-list-page">
    <!-- 筛选组件放在上面 -->
    <div class="filter-panel-wrapper" style="margin-bottom: 20px;">
      <FilterPanel @filtersChanged="onFiltersChange" />
    </div>

    <!-- 商品列表组件 -->
    <ProductList :filters="filters" />
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue"
import FilterPanel from "./FilterPanel.vue"
import ProductList from "./ProductList.vue"

const filters = reactive({
  q: "",
  category: "",
  priceMin: null,
  priceMax: null,
})

function onFiltersChange(newFilters: any) {
  Object.assign(filters, newFilters)
}
</script>

<style scoped>
.product-list-page {
  padding: 16px;
}
</style>
