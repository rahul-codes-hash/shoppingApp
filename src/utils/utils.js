// utils/utils.js

// Preload all page modules for Vite to statically analyze them
const viewModules = import.meta.glob('../pages/*.js');

// Dynamically load a view's HTML and corresponding JS module
export function autoLoadView(viewName) {
  return async (params = {}, query = {}) => {
    // Load HTML template
    const html = await fetch(`/src/templates/${viewName}.html`).then(r => r.text());

    // Apply JS behavior via dynamic import
    requestAnimationFrame(async () => {
      const importer = viewModules[`../pages/${viewName}.js`];
      if (importer) {
        const module = await importer();
        if (typeof module.default === 'function') {
          module.default(params, query);
        }
      } else {
        console.warn(`No page module found for ${viewName}`);
      }
    });

    return html;
  };
}

// Utility: Update document title
export function setTitle(title) {
  document.title = title || "Vanilla JS App";
}

// Utility: Scroll to top (with smooth animation)
export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Utility: Parse query string to object
export function getQueryParams(queryString) {
  const params = new URLSearchParams(queryString);
  return Object.fromEntries(params.entries());
}
