import type {
  Product,
  FetchProductsParams,
  FetchProductsResponse,
  Category
} from '@/types/types'

const CATEGORIES: Category[] = ['electronics', 'apparel', 'home']

const SAMPLE_PRODUCTS: Product[] = Array.from({ length: 500 }).map((_, i) => ({
  id: i + 1,
  title: `商品 #${i + 1}`,
  description: '这是一个示例商品描述，展示商品的简短信息。',
  price: Number((Math.random() * 1000 + 20).toFixed(2)),
  category: CATEGORIES[i % CATEGORIES.length] as Category,
  image: `https://picsum.photos/seed/product-${i + 1}/300/300`,
  sold: Math.floor(Math.random() * 1000)
}))

export async function fetchProducts(
  params: FetchProductsParams = {}
): Promise<FetchProductsResponse> {
  const { page = 1, pageSize = 12, filters = {}, sort = 'default' } = params

  await new Promise((r) => setTimeout(r, 1400 + Math.random() * 300))

  let items = [...SAMPLE_PRODUCTS]

  if (filters.q) {
    const q = filters.q.toLowerCase()
    items = items.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    )
  }

  if (filters.category) items = items.filter((p) => p.category === filters.category)
  if (filters.priceMin != null) items = items.filter((p) => p.price >= filters.priceMin!)
  if (filters.priceMax != null) items = items.filter((p) => p.price <= filters.priceMax!)

  if (sort === 'price_asc') items.sort((a, b) => a.price - b.price)
  else if (sort === 'price_desc') items.sort((a, b) => b.price - a.price)
  else if (sort === 'sold_desc') items.sort((a, b) => b.sold - a.sold)

  const total = items.length
  const from = (page - 1) * pageSize
  const pageItems = items.slice(from, from + pageSize)

  return { items: pageItems, total }
}

export async function fetchRecommendations({ basedOn = '' } = {}) {
  await new Promise((r) => setTimeout(r, 300))

  let candidates = [...SAMPLE_PRODUCTS]

  if (basedOn) {
    const q = basedOn.toLowerCase()
    candidates = candidates.filter(
      (p) => p.title.toLowerCase().includes(q) || p.category === q
    )
  }

  candidates.sort(() => Math.random() - 0.5)
  return candidates.slice(0, 10)
}
