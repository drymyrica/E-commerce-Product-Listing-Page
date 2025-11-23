export type Category = 'electronics' | 'apparel' | 'home'

export interface Product {
  id: number
  title: string
  description: string
  price: number
  category: Category
  image: string
  sold: number
}

export interface ProductFilters {
  q?: string
  category?: string
  priceMin?: number | null
  priceMax?: number | null
}

export interface FetchProductsParams {
  page?: number
  pageSize?: number
  filters?: ProductFilters
  sort?: string
}

export interface FetchProductsResponse {
  items: Product[]
  total: number
}
