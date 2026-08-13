import type { Config } from "tailwindcss";

export default {
    // 다크모드를 'class' 기반으로 설정 (최상위 태그에 'dark' 클래스가 있으면 다크모드 적용)
    darkMode: "class",

    // Tailwind 클래스를 사용할 경로 지정 (프로젝트 구조에 맞게 수정 가능)
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
        "./types/**/*.{js,jsx,ts,tsx}",
    ],

    // NativeWind v4 사용 시 필요한 프리셋 설정
    presets: [require("nativewind/preset")],

    theme: {
        extend: {
            colors: {
                /* ===== Primary / Brand ===== */
                // 사용 예: bg-primary-main, text-primary-light
                primary: {
                    main: "var(--primary-main)",
                    light: "var(--primary-light)",
                    sub: "var(--primary-sub)",
                    dark: "var(--primary-dark)",
                },

                /* ===== Accent ===== */
                // 사용 예: bg-accent-coral, text-accent-sky
                accent: {
                    coral: "var(--accent-coral)",
                    peach: "var(--accent-peach)",
                    sky: "var(--accent-sky)",
                    lavender: "var(--accent-lavender)",
                },

                /* ===== Background / Surface ===== */
                // 사용 예: bg-background, bg-surface
                background: "var(--background)",
                surface: "var(--surface)",
                card: "var(--card)",

                /* ===== Border / Divider ===== */
                // 사용 예: border-border, border-divider
                border: "var(--border)",
                divider: "var(--divider)",
                disabled: "var(--disabled)",

                /* ===== Text ===== */
                // 사용 예: text-text-primary, text-text-secondary
                text: {
                    primary: "var(--text-primary)",
                    secondary: "var(--text-secondary)",
                    tertiary: "var(--text-tertiary)",
                    disabled: "var(--text-disabled)",
                },

                /* ===== Semantic ===== */
                // 사용 예: bg-success, text-error
                success: "var(--success)",
                warning: "var(--warning)",
                error: "var(--error)",
                info: "var(--info)",

                /* ===== Chart ===== */
                // 사용 예: bg-chart-1, text-chart-2
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
            // 사용 예: bg-gradient-primary
            backgroundImage: {
                "gradient-primary": "var(--gradient-primary)",
                "gradient-sunset": "var(--gradient-sunset)",
            },
        },
    },

    plugins: [],
    safelist: [
        {
            // 1. primary, text, chart, accent 등 서브키가 존재하는 색상 처리
            pattern:
                /(bg|text|border)-(primary|accent|text|chart)-(main|light|sub|dark|coral|peach|sky|lavender|primary|secondary|tertiary|disabled|1|2|3|4|5|6)/,
        },
        {
            // 2. background, surface, card, border, success 등 단일 키 색상 처리
            pattern:
                /(bg|text|border)-(background|surface|card|border|divider|disabled|success|warning|error|info)/,
        },
        {
            // 3. 그라디언트 배경 처리
            pattern: /^bg-gradient-(primary|sunset)$/,
        },
    ],
} satisfies Config;
