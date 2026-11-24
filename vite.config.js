import { defineConfig } from 'vite'

export default defineConfig({
    // Relative base: the same build works at the GitHub Pages subpath
    // (/androidAPS_testedHardwareEasyBrowser/) and at a Cloudflare Pages root domain.
    base: './',
})
