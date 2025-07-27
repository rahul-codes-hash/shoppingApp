import { store } from "../utils/store.js";

export default function (params) {
  const { id } = params;
  requestAnimationFrame(() => {
    const btn = document.querySelector("#add-to-cart");
    if (btn) {
      btn.addEventListener("click", () => {
        store.addToCart({ id, name: `Product ${id}`, qty: 1 });
        alert(`Added product ${id} to cart`);
      });
    }
  });
}
