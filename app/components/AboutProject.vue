<script setup lang="ts">
interface Props {
  portfolioUrl: string
  supportUrl: string
}

interface AboutItem {
  number: string
  title: string
  description: string
}

defineProps<Props>()

const aboutItems: AboutItem[] = [
  {
    number: '01',
    title: 'Про проєкт',
    description: 'Таймер - це лише інтерфейс. Кожне рішення підтримує найкоротший шлях: відкрити, налаштувати, почати, сфокусуватися. Час обчислюється за часовими мітками, тому фонові вкладки й обмеження браузера непомітно не крадуть секунди.'
  },
  {
    number: '02',
    title: 'Про автора',
    description: 'Проєкт самостійно створив Олександр Зайцев - frontend-розробник, який спеціалізується на Vue, Nuxt і TypeScript. Це водночас корисний публічний інструмент і справжній production-експеримент.'
  },
  {
    number: '03',
    title: 'Технології',
    description: 'Nuxt 4 · Vue 3 · TypeScript · SCSS-архітектура · composables · збереження даних у localStorage · SSR · майбутня підтримка PWA.'
  },
  {
    number: '04',
    title: 'Майбутнє продукту',
    description: 'Розумні кола, послідовності та атмосферні теми з’являться згодом. Цифровий компаньйон, сад продуктивності, спільні кімнати й глобальні лічильники фокусу свідомо залишаються за межами MVP.'
  }
]
</script>

<template>
  <main class="about-project">
    <div class="about-project__container">
      <p class="about-project__eyebrow">
        Незалежний вебпродукт
      </p>

      <h1 class="about-project__title">
        <span class="about-project__title-line">Створено для фокусу.</span>
        <span class="about-project__title-line about-project__title-line--secondary">
          Готово розвиватися.
        </span>
      </h1>

      <p class="about-project__description">
        ZAITSEV.POMODORO - спокійний цифровий інструмент для людей, які хочуть почати працювати без зайвих налаштувань, облікових записів і відволікань.
      </p>

      <section
        class="about-project__grid"
        aria-label="Інформація про проєкт"
      >
        <article
          v-for="item in aboutItems"
          :key="item.number"
          class="about-project__item"
        >
          <span class="about-project__number" aria-hidden="true">
            {{ item.number }}
          </span>
          <h2 class="about-project__item-title">
            {{ item.title }}
          </h2>
          <p class="about-project__item-description">
            {{ item.description }}
          </p>
        </article>
      </section>

      <div class="about-project__actions">
        <a
          class="about-project__button about-project__button--primary"
          :href="portfolioUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M8 9L5 12L8 15M16 9L19 12L16 15M14 5L10 19" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          Переглянути портфоліо
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M7 17L17 7M9 7H17V15" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </a>

        <a
          class="about-project__button about-project__button--secondary"
          :href="supportUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 8H16V14A5 5 0 0 1 11 19H10A5 5 0 0 1 5 14V8Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
            <path d="M16 10H18A2 2 0 0 1 18 14H16M8 4V6M11 4V6M14 4V6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
          </svg>
          Підтримати проєкт
        </a>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
.about-project {
  width: 100%;
  min-height: calc(100svh - 160px);
  padding: 62px 12px 72px;
  background: $color-bg;

  @include breakpoint($tablet) {
    padding: 70px 30px 76px;
  }

  &__container {
    width: 100%;
    max-width: 760px;
    margin: 0 auto;
  }

  &__eyebrow {
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 3px;
    @include font(9px, 1.3, $mainFontName, $color-primary, 800);
  }

  &__title {
    display: flex;
    flex-direction: column;
    margin: 28px 0 0;
    letter-spacing: -3px;
    @include font(30px, 1.02, $mainFontName, $color-text, 600);

    @include breakpoint($mobile) {
      @include font(42px, 0.98, $mainFontName, $color-text, 600);
    }

    @include breakpoint($tablet) {
      @include font(62px, 0.98, $mainFontName, $color-text, 600);
    }
  }

  &__title-line {
    display: block;

    &--secondary {
      color: $color-text-secondary;
    }
  }

  &__description {
    max-width: 650px;
    margin: 30px 0 0;
    @include font(15px, 1.65, $mainFontName, $color-text-secondary, 400);

    @include breakpoint($tablet) {
      @include font(14px, 1.7, $mainFontName, $color-text-secondary, 400);
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    margin-top: 46px;
    border-top: 1px solid $color-border;
    border-left: 1px solid $color-border;

    @include breakpoint($tablet) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      margin-top: 66px;
    }
  }

  &__item {
    min-width: 0;
    padding: 34px 26px 32px;
    border-right: 1px solid $color-border;
    border-bottom: 1px solid $color-border;

    @include breakpoint($tablet) {
      min-height: 194px;
      padding: 32px 26px;
    }
  }

  &__number {
    display: block;
    @include font(9px, 1.2, $mainFontName, $color-primary, 800);
  }

  &__item-title {
    margin: 26px 0 0;
    @include font(14px, 1.3, $mainFontName, $color-text, 600);
  }

  &__item-description {
    margin: 13px 0 0;
    overflow-wrap: anywhere;
    @include font(11px, 1.65, $mainFontName, $color-text-secondary, 400);
  }

  &__actions {
    display: grid;
    gap: 9px;
    margin-top: 40px;

    @include breakpoint($mobile) {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
    }
  }

  &__button {
    @include flex(center, center);
    min-height: 42px;
    gap: 9px;
    padding: 11px 17px;
    text-decoration: none;
    border: 1px solid $color-border;
    border-radius: 9px;
    @include font(12px, 1.2, $mainFontName, $color-text, 600);
    transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease;

    &:focus-visible {
      outline: 2px solid $color-primary;
      outline-offset: 3px;
    }

    &--primary {
      color: $color-text-dark;
      background: $color-primary;
      border-color: $color-primary;
      box-shadow: 0 8px 28px $color-primary-dark;

      &:hover {
        background: $color-primary-dark;
        border-color: $color-primary-dark;
      }
    }

    &--secondary {
      background: $color-surface;

      &:hover {
        color: $color-primary;
        border-color: $color-primary;
      }
    }
  }
}
</style>
