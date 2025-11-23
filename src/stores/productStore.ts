import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product, FetchProductsParams } from '@/types/types'
import * as api from '@/mock/api'

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([])
  const total = ref(0)
  const loading = ref(false)

  async function fetchProducts(params: FetchProductsParams = {}) {
    loading.value = true
    try {
      const resp = await api.fetchProducts(params)
      products.value = resp.items
      total.value = resp.total
    } finally {
      loading.value = false
    }
  }

  async function fetchRecommendations({ basedOn = '' } = {}) {
    const recs = await api.fetchRecommendations({ basedOn })
    return recs
  }

  return { products, total, loading, fetchProducts, fetchRecommendations }
})
