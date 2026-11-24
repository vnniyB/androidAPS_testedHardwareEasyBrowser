import { defineConfig } from 'vite'

export default defineConfig({
    // Relative base: the same build works at the GitHub Pages subpath
    // (/androidAPS_testedHardwareEasyBrowser/) and at a Cloudflare Pages root domain.
    base: './',
    // Keeps Wrangler's Vite auto-setup from erroring if it ever runs without wrangler.jsonc.
    plugins: [],
})
