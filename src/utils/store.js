const state = {
    cart: [],
  };
  
  const listeners = new Set();
  
  export const store = {
    getState() {
      return state;
    },
  
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  
    addToCart(product) {
      state.cart.push(product);
      store._notify();
    },
  
    removeFromCart(id) {
      state.cart = state.cart.filter(p => p.id !== id);
      store._notify();
    },
  
    clearCart() {
      state.cart = [];
      store._notify();
    },
  
    _notify() {
      for (const fn of listeners) fn(state);
    }
  };
  