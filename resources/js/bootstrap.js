import axios from "axios";
window.axios = axios;

window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

// Inertia.js route helper
window.route = (name, params, absolute, config = {}) => {
    // Basit route mapping - gerçek uygulamada Laravel'in route helper'ı kullanılır
    const routes = {
        "admin.dashboard": "/panel",
        "admin.users.index": "/panel/users",
        "admin.users.show": "/panel/users/:id",
        "admin.posts.index": "/panel/posts",
        "admin.posts.show": "/panel/posts/:id",
        "admin.comments.index": "/panel/comments",
        "admin.comments.show": "/panel/comments/:id",
    };

    let routePath = routes[name];
    if (!routePath) {
        console.warn(`Route '${name}' not found`);
        return "#";
    }

    // URL parametrelerini değiştir
    if (params) {
        Object.keys(params).forEach((key) => {
            routePath = routePath.replace(`:${key}`, params[key]);
        });
    }

    // Route objesi oluştur
    const routeObj = {
        toString: () => routePath,
        current: (pattern) => {
            const currentPath = window.location.pathname;

            // Pattern matching
            if (pattern.includes("*")) {
                const basePattern = pattern.replace("*", "");
                return currentPath.startsWith(basePattern);
            }

            // Exact matching
            const routePatterns = {
                "admin.dashboard": "/panel",
                "admin.users.index": "/panel/users",
                "admin.users.show": "/panel/users/",
                "admin.posts.index": "/panel/posts",
                "admin.posts.show": "/panel/posts/",
                "admin.comments.index": "/panel/comments",
                "admin.comments.show": "/panel/comments/",
            };

            const expectedPath = routePatterns[pattern];
            if (!expectedPath) {
                return false;
            }

            return (
                currentPath === expectedPath ||
                currentPath.startsWith(expectedPath)
            );
        },
    };

    return routeObj;
};
