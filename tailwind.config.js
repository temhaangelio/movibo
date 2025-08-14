import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.jsx",
    ],

    darkMode: "class",

    theme: {
        extend: {
            fontFamily: {
                sans: ["Figtree", ...defaultTheme.fontFamily.sans],
            },
            colors: {
                gray: {
                    50: "#f9fafb",
                    100: "#f3f4f6",
                    200: "#e5e7eb",
                    300: "#d1d5db",
                    400: "#9ca3af",
                    500: "#6b7280",
                    600: "#4b5563",
                    700: "#374151",
                    800: "#1f2937",
                    900: "#111827",
                },
                // Dark tema için Swiss Gaming tarzı renk paleti
                dark: {
                    50: "#1a1a1a",
                    100: "#2d2d2d",
                    200: "#404040",
                    300: "#525252",
                    400: "#666666",
                    500: "#808080",
                    600: "#999999",
                    700: "#b3b3b3",
                    800: "#cccccc",
                    900: "#e6e6e6",
                },
                // Vurgu renkleri
                accent: {
                    purple: "#8b5cf6",
                    magenta: "#ec4899",
                    blue: "#3b82f6",
                    green: "#10b981",
                    red: "#ef4444",
                    yellow: "#f59e0b",
                },
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideInUp: {
                    "0%": {
                        opacity: "0",
                        transform: "translateY(30px)",
                    },
                    "100%": {
                        opacity: "1",
                        transform: "translateY(0)",
                    },
                },
            },
            animation: {
                "fade-in": "fadeIn 1s ease-out forwards",
                "slide-in-up": "slideInUp 1s ease-out forwards",
            },
        },
    },

    plugins: [forms],
};
