const siteUrl = 'https://zaitsev-pomodoro.vercel.app'
const siteName = 'Zaitsev.Pomodoro'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: {
    enabled: true,
  },

  ssr: true,

  site: {
    url: siteUrl,
    name: siteName,
  },

  app: {
    head: {
      title: 'Таймер Помодоро онлайн | Zaitsev.Pomodoro',

      htmlAttrs: {
        lang: 'uk',
      },

      meta: [
        {
          name: 'google-site-verification',
          content: 'es3wFQRRVZuXBB_-GmmzYS8RTb09NanArkvpmMBamec',
        },
        {
          name: 'description',
          content:
            'Безкоштовні інструменти для роботи й навчання: таймер Помодоро, секундомір, зворотний відлік і годинник. Налаштування інтервалів і тем оформлення.',
        },
        {
          property: 'og:site_name',
          content: siteName,
        },
        {
          property: 'og:type',
          content: 'website',
        },
        {
          property: 'og:locale',
          content: 'uk_UA',
        },
        {
          name: 'twitter:card',
          content: 'summary',
        },
      ],

      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/favicon.svg',
        },
      ],
    },
  },

  modules: [
    '@nuxtjs/google-fonts',
    '@nuxtjs/sitemap',
  ],

  googleFonts: {
    families: {
      'Space Grotesk': [300, 400, 500, 600, 700],
    },
    display: 'swap',
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
          `,
        },
      },
    },
  },

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
})