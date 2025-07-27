import { store } from "../utils/store.js";

export default function (params) {
  const { categorySlug, id } = params;
  requestAnimationFrame(() => {
    const btn = document.querySelector("#add-to-cart");
    if (btn) {
      btn.addEventListener("click", () => {
        store.addToCart({
          id,
          name: `Product ${id} in ${categorySlug}`,
          qty: 1,
        });
        alert(`Added Product ${id} from ${categorySlug}`);
      });
    }
  });
}
