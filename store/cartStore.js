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
        set(state => ({
          items: { ...state.items, [product.id]: (state.items[product.id] || 0) + 1 }
        })),
      removeItem: (id) =>
        set(state => {
          const items = { ...state.items };
          delete items[id];
          return { items };
        }),
      changeQty: (id, delta) =>
        set(state => {
          const qty = (state.items[id] || 0) + delta;
          if (qty <= 0) {
            const items = { ...state.items };
            delete items[id];
            return { items };
          }
          return { items: { ...state.items, [id]: qty } };
        }),
      clearCart: () => set({ items: {} }),
      rehydrate: () => {
        const key = getCartKey();
        const stored = localStorage.getItem(key);
        const data = stored ? JSON.parse(stored) : { state: { items: {} } };
        set({ items: data.state?.items || {} });
      },
      totalItems: () => Object.values(get().items).reduce((a, b) => a + b, 0),
      totalPrice: (products) =>
        Object.entries(get().items).reduce((sum, [id, qty]) => {
          const p = products.find(x => x.id == id);
          return sum + (p ? p.price * qty : 0);
        }, 0),
    }),
    {
      name: 'cart-guest',
      storage: {
        getItem: (name) => {
          if (typeof window === 'undefined') return null;
          const key = getCartKey();
          const value = localStorage.getItem(key);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          if (typeof window === 'undefined') return;
          const key = getCartKey();
          localStorage.setItem(key, JSON.stringify(value));
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