import type { Config } from 'tailwindcss'

export default {
    darkMode: "class",
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    plugins: [],
} satisfies Config;
