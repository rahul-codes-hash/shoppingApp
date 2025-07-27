import { store } from "../utils/store.js";

export default function () {
  requestAnimationFrame(() => {
    const list = document.querySelector("#cart-items");
    const state = store.getState();

    list.innerHTML = state.cart.map(item =>
      `<li>${item.name} (Qty: ${item.qty})</li>`
    ).join("");
  });
}
