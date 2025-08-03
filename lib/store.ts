import { create } from "zustand"
import { persist } from "zustand/middleware"

interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  currency: string
  quantity: number
  storeId: string
  storeName: string
}

interface User {
  id: string
  email: string
  name: string
  walletAddress?: string
}

interface StoreState {
  // User state
  user: User | null
  setUser: (user: User | null) => void

  // Cart state
  cart: CartItem[]
  addToCart: (item: Omit<CartItem, "quantity">) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartCount: () => number
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // User state
      user: null,
      setUser: (user) => set({ user }),

      // Cart state
      cart: [],
      addToCart: (item) =>
        set((state) => {
          const existingItem = state.cart.find((cartItem) => cartItem.productId === item.productId)
          if (existingItem) {
            return {
              cart: state.cart.map((cartItem) =>
                cartItem.productId === item.productId ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
              ),
            }
          }
          return {
            cart: [...state.cart, { ...item, quantity: 1 }],
          }
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.productId !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          cart:
            quantity <= 0
              ? state.cart.filter((item) => item.productId !== productId)
              : state.cart.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
        })),
      clearCart: () => set({ cart: [] }),
      getCartTotal: () => {
        const { cart } = get()
        return cart.reduce((total, item) => total + item.price * item.quantity, 0)
      },
      getCartCount: () => {
        const { cart } = get()
        return cart.reduce((total, item) => total + item.quantity, 0)
      },
    }),
    {
      name: "selar-store",
      partialize: (state) => ({ cart: state.cart, user: state.user }),
    },
  ),
)
