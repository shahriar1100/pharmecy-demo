import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { products } from '../data/products'

const CartContext = createContext(null)
const key = 'apnar-pharmacy-cart-v1'

function loadCart() {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]')
    if (!Array.isArray(value)) return []
    return value.filter((item) => products.some((p) => p.id === item.id && p.price != null && p.purchaseMode === 'cart') && Number.isInteger(item.quantity) && item.quantity > 0).map((item) => ({ id: item.id, quantity: Math.min(item.quantity, 99) }))
  } catch { return [] }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart)
  useEffect(() => { localStorage.setItem(key, JSON.stringify(items)) }, [items])
  const add = (id, quantity = 1) => setItems((current) => current.some((x) => x.id === id) ? current.map((x) => x.id === id ? { ...x, quantity: Math.min(99, x.quantity + quantity) } : x) : [...current, { id, quantity }])
  const update = (id, quantity) => setItems((current) => quantity <= 0 ? current.filter((x) => x.id !== id) : current.map((x) => x.id === id ? { ...x, quantity: Math.min(99, quantity) } : x))
  const remove = (id) => setItems((current) => current.filter((x) => x.id !== id))
  const detailed = items.map((item) => ({ ...item, product: products.find((p) => p.id === item.id) })).filter((x) => x.product)
  const count = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = detailed.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const value = useMemo(() => ({ items: detailed, count, subtotal, add, update, remove }), [detailed, count, subtotal])
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
