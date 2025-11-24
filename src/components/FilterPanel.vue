<template>
  <el-card>
    <h3>筛选</h3>

    <el-form label-position="top" :model="filters" @submit.prevent>
      <el-form-item label="关键词">
        <el-input v-model="filters.q" placeholder="搜索商品" @input="onFilterChange" />
      </el-form-item>

      <el-form-item label="分类">
        <el-select v-model="filters.category" placeholder="选择分类" @change="onFilterChange">
          <el-option label="全部" :value="''" />
          <el-option label="电子" value="electronics" />
          <el-option label="服饰" value="apparel" />
          <el-option label="家居" value="home" />
        </el-select>
      </el-form-item>

      <el-form-item label="价格区间">
        <el-input-number v-model="filters.priceMin" :min="0" placeholder="最小" @change="onFilterChange" />
        -
        <el-input-number v-model="filters.priceMax" :min="0" placeholder="最大" @change="onFilterChange" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="applyFilters">应用</el-button>
        <el-button @click="resetFilters">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 猜你喜欢 -->
    <div class="recommend-card" style="margin-top:16px">
      <h4>猜你喜欢</h4>
      <el-skeleton :rows="3" animated v-if="recLoading" />

      <el-row v-else v-for="rec in recommendations" :key="rec.id" style="margin-bottom:10px">
        <el-col :span="6">
          <img :src="rec.image" style="width:100%;border-radius:6px;" />
        </el-col>

        <el-col :span="18">
          <div style="font-weight:600">{{ rec.title }}</div>
          <div style="color:#999;font-size:12px">¥{{ rec.price }}</div>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { reactive, ref, watch, onMounted } from "vue"
import { useProductStore } from "../stores/productStore"
import { useDebounceFn } from "@vueuse/core"
import type { Product } from "../types/types"

const emit = defineEmits(["filtersChanged"])

const store = useProductStore()

const filters = reactive({
  q: "",
  category: "",
  priceMin: null as number | null,
  priceMax: null as number | null,
})

const recommendations = ref<Product[]>([])
const recLoading = ref(false)

// ------ debounced ------
const triggerFilters = useDebounceFn(() => {
  emit("filtersChanged", { ...filters })
  fetchRecommendations()
}, 400)

function onFilterChange() {
  triggerFilters()
}

function applyFilters() {
  emit("filtersChanged", { ...filters })
  fetchRecommendations()
}

function resetFilters() {
  filters.q = ""
  filters.category = ""
  filters.priceMin = null
  filters.priceMax = null
  emit("filtersChanged", { ...filters })
  fetchRecommendations()
}

async function fetchRecommendations() {
  recLoading.value = true
  recommendations.value = await store.fetchRecommendations({
    basedOn: filters.q || filters.category,
  })
  recLoading.value = false
}

onMounted(fetchRecommendations)
</script>
