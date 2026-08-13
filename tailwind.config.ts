import type { Config } from "tailwindcss";

export default {
    darkMode: "class",

    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],

    presets: [require("nativewind/preset")],

    theme: {
        extend: {
            colors: {
                /* ===== Primary / Brand ===== */
                primary: {
                    main: "var(--primary-main)",
                    light: "var(--primary-light)",
                    sub: "var(--primary-sub)",
                    dark: "var(--primary-dark)",
                },

                /* ===== Accent ===== */
                accent: {
                    coral: "var(--accent-coral)",
                    peach: "var(--accent-peach)",
                    sky: "var(--accent-sky)",
                    lavender: "var(--accent-lavender)",
                },

                /* ===== Background / Surface ===== */
                background: "var(--background)",
                surface: "var(--surface)",
                card: "var(--card)",

                /* ===== Border / Divider ===== */
                border: "var(--border)",
                divider: "var(--divider)",
                disabled: "var(--disabled)",

                /* ===== Text ===== */
                text: {
                    primary: "var(--text-primary)",
                    secondary: "var(--text-secondary)",
                    tertiary: "var(--text-tertiary)",
                    disabled: "var(--text-disabled)",
                },

                /* ===== Semantic ===== */
                success: "var(--success)",
                warning: "var(--warning)",
                error: "var(--error)",
                info: "var(--info)",

                /* ===== Chart ===== */
                chart: {
                    1: "var(--chart-1)",
                    2: "var(--chart-2)",
                    3: "var(--chart-3)",
                    4: "var(--chart-4)",
                    5: "var(--chart-5)",
                    6: "var(--chart-6)",
                },
            },

            /* ===== Gradient ===== */
            backgroundImage: {
                "gradient-primary": "var(--gradient-primary)",
                "gradient-sunset": "var(--gradient-sunset)",
            },
        },
    },

    plugins: [],
} satisfies Config;
