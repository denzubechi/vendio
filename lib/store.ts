import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  currency: string;
  quantity: number;
  storeId: string;
  storeName: string;
  imageUrl?: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  walletAddress?: string;
  avatar?: string;
  bio?: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  type: string;
  category?: string;
  imageUrls: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Store {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  banner?: string;
  theme?: any;
  isActive: boolean;
}

interface LinkInBio {
  id: string;
  title: string;
  description?: string;
  avatar?: string;
  theme?: any;
  links: Array<{
    id: string;
    title: string;
    url: string;
    isActive: boolean;
  }>;
  isActive: boolean;
}

interface StoreState {
  // User state
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;

  // Products state
  products: Product[];
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;

  // Store state
  store: Store | null;
  setStore: (store: Store | null) => void;
  updateStore: (updates: Partial<Store>) => void;

  // Link in Bio state
  linkInBio: LinkInBio | null;
  setLinkInBio: (linkInBio: LinkInBio | null) => void;
  updateLinkInBio: (updates: Partial<LinkInBio>) => void;

  // Cart state
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;

  // UI state
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Filters
  productFilters: {
    search: string;
    category: string;
    type: string;
    status: string;
  };
  setProductFilters: (filters: Partial<StoreState["productFilters"]>) => void;

  // Modal states
  showAddProductModal: boolean;
  setShowAddProductModal: (show: boolean) => void;
  showEditProductModal: boolean;
  setShowEditProductModal: (show: boolean) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // User state
      user: null,
      setUser: (user) => set({ user }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      // Products state
      products: [],
      setProducts: (products) => set({ products }),
      addProduct: (product) =>
        set((state) => ({
          products: [product, ...state.products],
        })),
      updateProduct: (id, updates) =>
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id ? { ...product, ...updates } : product
          ),
        })),
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
        })),
      selectedProduct: null,
      setSelectedProduct: (product) => set({ selectedProduct: product }),

      // Store state
      store: null,
      setStore: (store) => set({ store }),
      updateStore: (updates) =>
        set((state) => ({
          store: state.store ? { ...state.store, ...updates } : null,
        })),

      // Link in Bio state
      linkInBio: null,
      setLinkInBio: (linkInBio) => set({ linkInBio }),
      updateLinkInBio: (updates) =>
        set((state) => ({
          linkInBio: state.linkInBio
            ? { ...state.linkInBio, ...updates }
            : null,
        })),

      // Cart state
      cart: [],
      addToCart: (item) =>
        set((state) => {
          const existingItem = state.cart.find(
            (cartItem) => cartItem.productId === item.productId
          );
          if (existingItem) {
            return {
              cart: state.cart.map((cartItem) =>
                cartItem.productId === item.productId
                  ? { ...cartItem, quantity: cartItem.quantity + 1 }
                  : cartItem
              ),
            };
          }
          return {
            cart: [...state.cart, { ...item, quantity: 1 }],
          };
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
              : state.cart.map((item) =>
                  item.productId === productId ? { ...item, quantity } : item
                ),
        })),
      clearCart: () => set({ cart: [] }),
      getCartTotal: () => {
        const { cart } = get();
        return cart.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
      getCartCount: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + item.quantity, 0);
      },

      // UI state
      activeTab: "overview",
      setActiveTab: (tab) => set({ activeTab: tab }),
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),

      // Filters
      productFilters: {
        search: "",
        category: "",
        type: "",
        status: "",
      },
      setProductFilters: (filters) =>
        set((state) => ({
          productFilters: { ...state.productFilters, ...filters },
        })),

      // Modal states
      showAddProductModal: false,
      setShowAddProductModal: (show) => set({ showAddProductModal: show }),
      showEditProductModal: false,
      setShowEditProductModal: (show) => set({ showEditProductModal: show }),
    }),
    {
      name: "Vendio-store",
      partialize: (state) => ({
        cart: state.cart,
        user: state.user,
        activeTab: state.activeTab,
        productFilters: state.productFilters,
      }),
    }
  )
);
