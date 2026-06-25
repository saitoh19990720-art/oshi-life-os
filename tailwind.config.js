/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      // テーマはCSS変数で切替（ライト/ダーク）。淡色水色＝しずく正本ベース。
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        card: "var(--card)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        accent: "var(--accent)",
        "accent-soft": "var(--accent-soft)",
        line: "var(--line)",
      },
      fontFamily: {
        mincho: ['"Shippori Mincho"', "serif"],
        gothic: ['"Zen Kaku Gothic New"', "sans-serif"],
      },
      maxWidth: { phone: "430px" },
      boxShadow: {
        soft: "0 6px 20px rgba(62,95,133,0.08)",
      },
    },
  },
  plugins: [],
};
