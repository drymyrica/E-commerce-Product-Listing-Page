<template>
    <el-card>
        <!-- 顶部 -->
        <div class="list-header">
            <div class="count">共找到 <span class="highlight">{{ total }}</span> 件商品</div>

            <el-select v-model="sort" size="small" @change="onSortChange">
                <el-option label="默认排序" value="default" />
                <el-option label="价格：低到高" value="price_asc" />
                <el-option label="价格：高到低" value="price_desc" />
                <el-option label="销量优先" value="sold_desc" />
            </el-select>
        </div>

        <!-- 自定义骨架屏 -->
        <div v-if="loading && products.length === 0">
            <RecycleScroller :items="skeletonRows" :item-size="450" key-field="0" page-mode >
                <template #default="{ item: row }">
                    <div class="grid-row">
                        <ProductSkeletonCard v-for="i in row" :key="i" />
                    </div>
                </template>
            </RecycleScroller>
        </div>

        <!-- 虚拟滚动 3x4 网格 -->
        <RecycleScroller v-else :items="rows" :item-size="450" key-field="0" page-mode>
            <template #default="{ item: row }">
                <div class="grid-row">
                    <ProductCard v-for="product in row" :key="product.id" :product="product" @add-to-cart="addToCart" />
                    <div v-for="n in (4 - row.length%4)%4" :key="'empty-' + n" class="product-card empty-card"></div>
                </div>
            </template>
        </RecycleScroller>

        <!-- 分页 -->
        <div class="pagination-box">
            <el-pagination background layout="prev, pager, next, sizes, total" :total="total" :page-size="pageSize"
                v-model:current-page="page" @size-change="onPageSizeChange" />
        </div>
    </el-card>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from "vue"
import { RecycleScroller } from "vue3-virtual-scroller"
import "vue3-virtual-scroller/dist/vue3-virtual-scroller.css"

import { useProductStore } from "../stores/productStore"
import { ElMessage } from "element-plus"
import type { Product } from "../types/types"
import ProductCard from "../components/ProductCard.vue"
import ProductSkeletonCard from "../components/ProductSkeletonCard.vue"

const props = defineProps<{
    filters: any
}>()

const store = useProductStore()

// 排序 & 分页
const sort = ref("default")
const page = ref(1)
const pageSize = ref(12)

const loading = computed(() => store.loading)
const products = computed(() => store.products)
const total = computed(() => store.total)

// 按行分组，每行 4 个
const rows = computed(() => {
    const perRow = 4
    const temp: Product[][] = []
    for (let i = 0; i < products.value.length; i += perRow) {
        temp.push(products.value.slice(i, i + perRow))
    }
    return temp
})

const skeletonRows = computed(() => {
    const rows: number[][] = []
    const totalSkeletons = pageSize.value
    const perRow = 4
    for (let i = 0; i < totalSkeletons; i += perRow) {
        rows.push(Array.from({ length: perRow }, (_, idx) => i+idx))
    }
    return rows
})

async function loadData() {
    await store.fetchProducts({
        page: page.value,
        pageSize: pageSize.value,
        filters: props.filters,
        sort: sort.value,
    })
}

// 监听筛选条件变化
watch(
    () => props.filters,
    () => {
        page.value = 1
        loadData()
    },
    { deep: true }
)

// 监听分页变化
watch([page, pageSize], () => loadData())

onMounted(loadData)

function onSortChange() {
    page.value = 1
    loadData()
}

function onPageSizeChange(size: number) {
    pageSize.value = size
    page.value = 1
}

function addToCart(item: Product) {
    ElMessage.success(`${item.title} 已加入购物车`)
}
</script>

<style scoped>
.list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.count {
    font-size: 16px;
}

.highlight {
    color: #409eff;
    font-weight: 600;
}

.skeleton-card {
    height: 400px;
    border-radius: 12px;
}

.pagination-box {
    margin-top: 20px;
    display: flex;
    justify-content: center;
}

.grid-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.grid-row .product-card {
  width: calc((100% - 60px) / 4); /* 4 个卡片，间距 20px*3 */
  min-width: 0;
}

.empty-card {
  visibility: hidden; /* 占位，不显示内容 */
}

</style>
