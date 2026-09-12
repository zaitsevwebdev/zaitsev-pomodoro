<script setup lang="ts">
import DigitalClock from '~/components/DigitalClock.vue'

const route = useRoute()
const siteUrl = 'https://zaitsev-pomodoro.vercel.app'

const title = 'Час у Києві зараз - онлайн-годинник | Zaitsev.Pomodoro'
const description =
  'Поточний час у Києві з секундами, днем тижня та датою. Онлайн-годинник у часовому поясі Europe/Kyiv із повноекранним режимом.'

const canonicalUrl = computed(() => `${siteUrl}${route.path}`)

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogType: 'website',
  ogUrl: () => canonicalUrl.value,
  ogSiteName: 'Zaitsev.Pomodoro',
  ogLocale: 'uk_UA',
  twitterCard: 'summary',
  twitterTitle: title,
  twitterDescription: description,
})

useHead(() => ({
  htmlAttrs: {
    lang: 'uk',
  },
  link: [
    {
      key: 'canonical',
      rel: 'canonical',
      href: canonicalUrl.value,
    },
  ],
}))
</script>

<template>
  <main class="clock-page">
    <header class="clock-page__intro">
      <h1 class="clock-page__title">
        Час у Києві зараз
      </h1>

      <p class="clock-page__description">
        Онлайн-годинник із секундами, днем тижня та датою.
      </p>
    </header>

    <DigitalClock />

    <p class="clock-page__note">
      Час обчислюється за годинником вашого пристрою
      й відображається в часовому поясі Europe/Kyiv.
      Точність залежить від налаштувань часу на пристрої.
    </p>
  </main>
</template>

<style scoped lang="scss">
  .clock-page {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    min-height: calc(100svh - 160px);
    margin: 0;
    padding: 28px 20px 24px;
    background: $color-bg;
    color: $color-text;
    font-family: $mainFontName;

    @include breakpoint($tablet) {
      padding: 36px 24px 28px;
    }

    &__intro {
      flex-shrink: 0;
      text-align: center;
    }

    &__title {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      line-height: 1.25;
      letter-spacing: -0.035em;

      @include breakpoint($tablet) {
        font-size: 32px;
      }
    }

    &__description {
      margin: 12px 0 0;
      font-size: 14px;
      line-height: 1.7;
    }

    &__note {
      flex-shrink: 0;
      width: 100%;
      max-width: 620px;
      margin: 0 auto;
      font-size: 12px;
      line-height: 1.7;
      text-align: center;
    }
  }
</style>