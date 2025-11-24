<template>
  <div class="product-list-page">
    <el-row :gutter="20">
      <el-col :span="6">
        <FilterPanel @filtersChanged="onFiltersChange" />
      </el-col>

      <el-col :span="18">
        <ProductList :filters="filters" />
      </el-col>
    </el-row>
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
