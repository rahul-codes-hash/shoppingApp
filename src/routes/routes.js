import VanillaRouter from "../router/vanillaRouter.js";
import { autoLoadView } from "../utils/utils.js";

const routes = [
  { path: "/", view: autoLoadView("home"), title: "Home" },
  { path: "/products", view: autoLoadView("products"), title: "Products" },
  { path: "/product/:id", view: autoLoadView("product-detail"), title: ({ id }) => `Product ${id}` },
  {
    path: "/category/:categorySlug",
    view: autoLoadView("category"),
    title: ({ categorySlug }) => `Category: ${categorySlug}`,
    children: [
      {
        path: "product/:id",
        view: autoLoadView("category-product"),
        title: ({ id }) => `Product ${id}`
      }
    ]
  },
  { path: "/cart", view: autoLoadView("cart"), title: "Your Cart" }
];

export const router = new VanillaRouter({ routes });
