import "../css/app.css";
import "./bootstrap";
import "./i18n";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

// Tema değiştirme fonksiyonu
function setTheme(theme) {
    try {
        // Eğer tema değeri null, undefined veya boş string ise, varsayılan olarak "auto" kullan
        if (!theme || theme === "null" || theme === "undefined") {
            theme = "auto";
        }

        if (
            theme === "dark" ||
            (theme === "auto" &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
        ) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", theme);
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", theme);
        }
    } catch (error) {
        console.error("setTheme hatası:", error);
    }
}

// Sistem tema değişikliğini dinle
window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
        const currentTheme = localStorage.getItem("theme");
        if (currentTheme === "auto") {
            setTheme("auto");
        }
    });

// Sayfa yüklendiğinde tema ayarla
const theme = localStorage.getItem("theme") || "auto";
setTheme(theme);

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: "#111827",
    },
});

// Global tema değiştirme fonksiyonu
window.setTheme = setTheme;
