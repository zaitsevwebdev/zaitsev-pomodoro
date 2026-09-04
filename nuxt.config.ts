// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  site: {
    url: 'https://zaitsev-pomodoro.vercel.app',
    name: 'Zaitsev Pomodoro'
  },

  app: {
    head: {
      title: 'Zaitsev Pomodoro — Онлайн таймер помодоро для продуктивности',
      htmlAttrs: {
        lang: 'ru'
      },
      meta: [
        { 
          name: 'google-site-verification', 
          content: 'es3wFQRRVZuXBB_-GmmzYS8RTb09NanArkvpmMBamec' 
        },
        { 
          name: 'description', 
          content: 'Удобный и минималистичный онлайн таймер Pomodoro для работы и учебы. Настраивайте интервалы фокуса, короткие и длинные перерывы.' 
        },
        { 
          name: 'keywords', 
          content: 'pomodoro, помодоро таймер, таймер продуктивности, pomodoro timer online, таймер для учебы' 
        },
        { property: 'og:title', content: 'Zaitsev Pomodoro — Онлайн таймер помодоро' },
        { property: 'og:description', content: 'Бесплатный минималистичный таймер фокуса и интервалов работы.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://zaitsev-pomodoro.vercel.app' }
      ]
    }
  },
  modules: [
    '@nuxtjs/google-fonts',
    '@nuxtjs/sitemap'
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