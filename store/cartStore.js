import { create } from 'zustand';
import { persist } from 'zustand/middleware';

function getCartKey() {
  if (typeof window === 'undefined') return 'cart-guest';
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.id ? `cart-${user.id}` : 'cart-guest';
}

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: {},
      addItem: (product) =>
        set(state => {
          const existing = state.items[product.id] || { qty: 0, product };
          return {
            items: {
              ...state.items,
              [product.id]: {
                qty: existing.qty + 1,
                product
              }
            }
          };
        }),
      removeItem: (id) =>
        set(state => {
          const items = { ...state.items };
          delete items[id];
          return { items };
        }),
      changeQty: (id, delta) =>
        set(state => {
          const existing = state.items[id];
          if (!existing) return state;
          const qty = existing.qty + delta;
          if (qty <= 0) {
            const items = { ...state.items };
            delete items[id];
            return { items };
          }
          return {
            items: {
              ...state.items,
              [id]: { ...existing, qty }
            }
          };
        }),
      clearCart: () => set({ items: {} }),
      rehydrate: () => {
        const key = getCartKey();
        const stored = localStorage.getItem(key);
        const data = stored ? JSON.parse(stored) : { state: { items: {} } };
        set({ items: data.state?.items || {} });
      },
      totalItems: () => Object.values(get().items).reduce((sum, item) => sum + (item.qty || 0), 0),
      totalPrice: () =>
        Object.values(get().items).reduce((sum, item) => sum + (item.product?.price || 0) * item.qty, 0),
    }),
    {
      name: 'cart-guest',
      storage: {
        getItem: (name) => {
          if (typeof window === 'undefined') return null;
          const key = getCartKey();
          return localStorage.getItem(key);
        },
        setItem: (name, value) => {
          if (typeof window === 'undefined') return;
          const key = getCartKey();
          localStorage.setItem(key, value);
        },
        removeItem: (name) => {
          if (typeof window === 'undefined') return;
          const key = getCartKey();
          localStorage.removeItem(key);
        },
      }
    }
  )
);