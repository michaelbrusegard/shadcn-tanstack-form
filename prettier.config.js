/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions & import("@trivago/prettier-plugin-sort-imports").PluginConfig} */
const config = {
  semi: false,
  tabWidth: 2,
  useTabs: false,
  importOrder: ["^@/components/(.*)$"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  tailwindFunctions: ["cn", "cva"],
  plugins: [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
};

export default config;
