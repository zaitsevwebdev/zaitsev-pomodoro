<script setup lang="ts">
import CountdownTimer from '~/components/CountdownTimer.vue'

const route = useRoute()
const siteUrl = 'https://zaitsev-pomodoro.vercel.app'

const title = 'Таймер онлайн - зворотний відлік | Zaitsev.Pomodoro'
const description =
  'Безкоштовний онлайн-таймер на 1, 5, 10, 15, 30 або 60 хвилин. Зворотний відлік із паузою, продовженням і повторним запуском. Керування з клавіатури.'

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
  <main class="timer-page">
    <header class="timer-page__intro">
      <h1 class="timer-page__title">
        Таймер зворотного відліку онлайн
      </h1>

      <p class="timer-page__description">
        Оберіть 1, 5, 10, 15, 30 або 60 хвилин і почніть відлік.
      </p>
    </header>

    <CountdownTimer />

    <p class="timer-page__note">
      Start запускає таймер, Pause призупиняє відлік,
      а Reset повертає обрану тривалість.
      Після завершення з’явиться повідомлення «Час вийшов».
      Зміна тривалості скидає поточний відлік.
      Після оновлення сторінки таймер повертається до 10 хвилин.
    </p>
  </main>
</template>

<style scoped lang="scss">
  .timer-page {
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
      text-align: center;
    }

    &__title {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      line-height: 1.25;
      letter-spacing: -0.035em;
      text-wrap: balance;

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
      width: 100%;
      max-width: 680px;
      margin: 0 auto;
      font-size: 12px;
      line-height: 1.8;
      text-align: center;
    }
  }
</style>