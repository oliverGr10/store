/**
 * Store del carrito de venta activo.
 * Vive solo en memoria — se limpia al cerrar la app.
 */

import { create } from 'zustand';
import { ICartItem, IProduct } from '@/types';

interface CartState {
  items: ICartItem[];

  // Computed
  total: () => number;
  itemCount: () => number;

  // Acciones
  addItem: (product: IProduct) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  total: () =>
    get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),

  itemCount: () =>
    get().items.reduce((sum, item) => sum + item.quantity, 0),

  addItem: (product) => {
    const items = get().items;
    const existing = items.find((i) => i.product.id === product.id);

    if (existing) {
      // Si ya existe, suma 1
      set({
        items: items.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        ),
      });
    } else {
      set({ items: [...items, { product, quantity: 1 }] });
    }
  },

  removeItem: (productId) =>
    set({ items: get().items.filter((i) => i.product.id !== productId) }),

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    set({
      items: get().items.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i,
      ),
    });
  },

  clear: () => set({ items: [] }),
}));
