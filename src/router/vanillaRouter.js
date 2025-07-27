// /router/vanillaRouter.js

import { setTitle, scrollToTop, getQueryParams } from "../utils/utils.js";

class VanillaRouter {
  constructor({ routes = [], root = "/" } = {}) {
    this.routes = [];
    this._currentRoute = null;
    this._componentCache = new Map();
    this.root = root;
    routes.forEach((r) => this.addRoute(r));
  }

  pathToRegex(path) {
    const paramNames = [];
    const regexStr = path.replace(/:([^/]+)/g, (_, name) => {
      paramNames.push(name);
      return "([^/]+)";
    });
    return { regex: new RegExp("^" + regexStr + "$"), paramNames };
  }

  addRoute(route) {
    const { path, children = [] } = route;
    const { regex, paramNames } = this.pathToRegex(path);
    const fullRoute = { ...route, regex, paramNames };
    this.routes.push(fullRoute);

    // Add child routes recursively
    children.forEach((child) => {
      const childPath = path.endsWith("/")
        ? path + child.path
        : path + "/" + child.path;
      this.addRoute({ ...child, path: childPath });
    });
  }

  async navigateTo(url) {
    const [rawPath, rawQuery] = url.split("?");
    const path = new URL(rawPath, location.origin).pathname;
    history.pushState(null, null, url);
    await this.routeHandler(path, rawQuery ?? "");
  }

  async routeHandler(pathname, rawQuery) {
    const queryParams = getQueryParams(rawQuery);
    const match = this.routes.find((r) => pathname.match(r.regex));

    if (!match) {
      return this.render(() => Promise.resolve("<h1>404 Not Found</h1>"), "404", {});
    }

    const result = pathname.match(match.regex);
    const params = match.paramNames.reduce((acc, name, i) => {
      acc[name] = result[i + 1];
      return acc;
    }, {});

    // Handle guards
    const guards = Array.isArray(match.guard)
      ? match.guard
      : match.guard
      ? [match.guard]
      : [];

    for (const guardFn of guards) {
      const passed = await guardFn(params, queryParams);
      if (!passed) {
        return this.render(() => Promise.resolve("<h1>Access Denied</h1>"), "Access Denied", {});
      }
    }

    // onLeave hook
    if (this._currentRoute?.onLeave) {
      try {
        this._currentRoute.onLeave(this._currentRoute.params);
      } catch (e) {
        console.error("Error in onLeave:", e);
      }
    }

    // onEnter hook
    if (match.onEnter) {
      try {
        await match.onEnter(params, queryParams);
      } catch (e) {
        return this.render(() => Promise.resolve("<h1>Error Entering Page</h1>"), "Error", {});
      }
    }

    this._currentRoute = { ...match, params, queryParams };

    // Keep-alive
    if (match.keepAlive && this._componentCache.has(match.path)) {
      const cachedHTML = this._componentCache.get(match.path);
      return this.render(() => Promise.resolve(cachedHTML), match.title, queryParams);
    }

    let html = "";
    try {
      html = await match.view(params, queryParams);
    } catch (e) {
      console.error("View error:", e);
      html = "<h1>Component Error</h1>";
    }

    if (match.keepAlive) {
      this._componentCache.set(match.path, html);
    }

    const title =
      typeof match.title === "function"
        ? match.title(params, queryParams)
        : match.title || "";

    this.render(() => Promise.resolve(html), title, queryParams);
  }

  render(htmlPromiseFn, title, queryParams) {
    htmlPromiseFn().then((html) => {
      const app = document.getElementById("app");
      if (!app) return;

      app.classList.add("opacity-0");
      setTimeout(() => {
        app.innerHTML = html;
        setTitle(title);
        scrollToTop();
        app.classList.remove("opacity-0");
        app.classList.add("transition-opacity", "duration-300", "opacity-100");
      }, 100);
    });
  }

  init() {
    document.addEventListener("click", (e) => {
      const link = e.target.closest("[data-link]");
      if (link) {
        const href = link.getAttribute("href");
        if (href.startsWith("http") || href.startsWith("mailto:")) return;
        e.preventDefault();
        this.navigateTo(href);
      }
    });

    window.addEventListener("popstate", () =>
      this.routeHandler(location.pathname, location.search.slice(1))
    );
    window.addEventListener("DOMContentLoaded", () =>
      this.routeHandler(location.pathname, location.search.slice(1))
    );
  }
}

export default VanillaRouter;