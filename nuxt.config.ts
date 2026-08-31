// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
      '@nuxtjs/google-fonts'
    ],

  googleFonts: {
      families: {
        "Space+Grotesk": [400, 500, 600, 700]
      }
    },

    css: ['~/assets/scss/main.scss'],

    vite: {
      css: {
        preprocessorOptions: {
          scss: {
            additionalData: `
              @use "~/assets/scss/global/colors" as *;
              @use "~/assets/scss/global/themes" as *;
              @use "~/assets/scss/global/breakpoints" as *;
              @use "~/assets/scss/global/mixins" as *;
              @use "~/assets/scss/global/fonts" as *;
            `
          }
        }
      }
    },

    components: [
      {
        path: '~/components',
        pathPrefix: false,
      },
    ],
})