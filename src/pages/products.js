export default function () {
    requestAnimationFrame(() => {
      const links = document.querySelectorAll(".product-link");
      links.forEach(link => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const id = link.getAttribute("data-id");
          history.pushState(null, null, `/product/${id}`);
          window.dispatchEvent(new PopStateEvent("popstate"));
        });
      });
    });
  }
  