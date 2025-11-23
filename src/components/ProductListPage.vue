<!-- ProductListPage.vue -->
<template>
  <div class="product-list-page">
    <el-row :gutter="20">
      <el-col :span="6">
        <!-- 筛选区域 -->
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

          <!-- 猜你喜欢（AI 模拟） -->
          <div class="recommend-card" style="margin-top:16px">
            <h4>猜你喜欢</h4>
            <el-skeleton :rows="1" animated v-if="recLoading" />
            <el-list v-else>
              <el-row v-for="rec in recommendations" :key="rec.id" style="margin-bottom:8px">
                <el-col :span="6">
                  <img :src="rec.image" alt="thumb" style="width:56px;height:56px;object-fit:cover;border-radius:4px" />
                </el-col>
                <el-col :span="18">
                  <div style="font-weight:600">{{ rec.title }}</div>
                  <div style="color:#999;font-size:12px">¥{{ rec.price }}</div>
                </el-col>
              </el-row>
            </el-list>
          </div>
        </el-card>
      </el-col>

      <el-col :span="18">
        <!-- 操作栏：排序 + 搜索快速入口 -->
        <el-row justify="space-between" align="middle" style="margin-bottom:12px">
          <el-col>
            <el-input v-model="filters.q" placeholder="快速搜索..." clearable @input="onFilterChange" style="width:320px" />
          </el-col>

          <el-col>
            <el-select v-model="sort" placeholder="排序" size="small" @change="onSortChange">
              <el-option label="默认" value="default" />
              <el-option label="价格：低到高" value="price_asc" />
              <el-option label="价格：高到低" value="price_desc" />
              <el-option label="销量" value="sold_desc" />
            </el-select>
          </el-col>
        </el-row>

        <!-- 列表: 使用骨架屏显示加载状态，结合虚拟滚动提高大列表性能 -->
        <el-card>
          <el-skeleton :rows="3" animated v-if="loading && !hasData" />

          <div v-else>
            <RecycleScroller :items="products" :item-size="120" key-field="id" v-slot="{ item }" :min-item-size="100">
              <div class="product-item" style="display:flex;gap:12px;padding:12px;border-bottom:1px solid #f2f2f2">
                <img :src="item.image" alt="thumb"
                  style="width:100px;height:100px;object-fit:cover;border-radius:6px" />
                <div style="flex:1">
                  <h4 style="margin:0">{{ item.title }}</h4>
                  <p style="margin:6px 0;color:#666">{{ item.description }}</p>
                  <div style="display:flex;justify-content:space-between;align-items:center">
                    <div style="font-weight:700">¥{{ item.price }}</div>
                    <el-button size="small" type="primary" @click="addToCart(item)">加入购物车</el-button>
                  </div>
                </div>
              </div>
            </RecycleScroller>

            <div style="display:flex;justify-content:center;margin-top:12px">
              <el-pagination background layout="prev, pager, next, sizes, total" :total="total" :page-size="pageSize"
                v-model:current-page="page" @size-change="onPageSizeChange" @current-change="onPageChange" />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useProductStore } from '../stores/productStore'
import { useDebounceFn } from '@vueuse/core'
import { RecycleScroller } from 'vue3-virtual-scroller'
import 'vue3-virtual-scroller/dist/vue3-virtual-scroller.css'
import type { Product } from '../types/types'

const store = useProductStore()

// 本地 UI 状态
const filters = reactive({ q: '', category: '', priceMin: null, priceMax: null })
const sort = ref('default')
const page = ref(1)
const pageSize = ref(12)

const loading = computed(() => store.loading)
const products = computed(() => store.products)
const total = computed(() => store.total)
const hasData = computed(() => products.value && products.value.length > 0)

const recommendations = ref < Product[] > ([])
const recLoading = ref(false)

// 防抖：避免频繁请求（加分项）
const doFetch = async () => {
  await store.fetchProducts({ page: page.value, pageSize: pageSize.value, filters: { ...filters }, sort: sort.value })
}
const debouncedFetch = useDebounceFn(doFetch, 500)

// 当筛选项、排序、分页变化时触发
watch([() => filters.q, () => filters.category, () => filters.priceMin, () => filters.priceMax, sort], () => {
  page.value = 1
  debouncedFetch()
})

watch([page, pageSize], () => {
  doFetch()
})

onMounted(async () => {
  await doFetch()
  fetchRecommendations()
})

function onFilterChange() {
  // 使用防抖函数
  debouncedFetch()
}

function onSortChange() {
  page.value = 1
  doFetch()
}

function onPageChange(p: number) {
  page.value = p
}

function onPageSizeChange(size: number) {
  pageSize.value = size
  page.value = 1
}

function applyFilters() {
  page.value = 1
  doFetch()
}

function resetFilters() {
  filters.q = ''
  filters.category = ''
  filters.priceMin = null
  filters.priceMax = null
  page.value = 1
  doFetch()
}

function addToCart(item: Product) {
  // 简单演示，可接入购物车模块
  ElMessage.success(`${item.title} 已加入购物车`)
}

async function fetchRecommendations() {
  recLoading.value = true
  // 模拟 AI 推荐：根据当前关键词或分类选取相似商品（这里只是模拟）
  const recs = await store.fetchRecommendations({ basedOn: filters.q || filters.category })
  recommendations.value = recs
  recLoading.value = false
}
</script>

<style scoped>
.product-list-page {
  padding: 16px
}

.product-item h4 {
  font-size: 16px
}
</style>
