<script setup lang="ts">
import StopwatchTimer from '~/components/StopwatchTimer.vue'

const route = useRoute()
const siteUrl = 'https://zaitsev-pomodoro.vercel.app'

const title = 'Секундомір онлайн із фіксацією кіл | Zaitsev.Pomodoro'
const description =
  'Безкоштовний онлайн-секундомір із паузою, продовженням відліку та фіксацією кіл. Години, хвилини, секунди й мілісекунди. Керування кнопками та клавіатурою.'

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
  <main class="stopwatch-page">
    <header class="stopwatch-page__intro">
      <h1 class="stopwatch-page__title">
        Секундомір онлайн
      </h1>

      <p class="stopwatch-page__description">
        Вимірюйте час і фіксуйте кола без зупинки відліку.
      </p>
    </header>

    <StopwatchTimer />

    <p class="stopwatch-page__note">
      Start запускає відлік, Pause призупиняє його.
      Lap зберігає загальний час від початку, а Reset очищає
      відлік і всі позначки. Після оновлення сторінки дані скидаються.
    </p>
  </main>
</template>

<style scoped lang="scss">
  .stopwatch-page {
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
      max-width: 640px;
      margin: 0 auto;
      font-size: 12px;
      line-height: 1.8;
      text-align: center;
    }
  }
</style>