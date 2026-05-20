import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
      totalItems: () => Object.values(get().items).reduce((a, b) => a + b, 0),
      totalPrice: (products) =>
        Object.entries(get().items).reduce((sum, [id, qty]) => {
          const p = products.find(x => x.id == id);
          return sum + (p ? p.price * qty : 0);
        }, 0),
    }),
    {
      name: () => {
        // Lưu giỏ hàng riêng theo từng user
        const user = typeof window !== 'undefined'
          ? JSON.parse(localStorage.getItem('user') || '{}')
          : {};
        return user.id ? `cart-${user.id}` : 'cart-guest';
      }
    }
  )
);