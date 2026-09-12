<script setup lang="ts">
const route = useRoute()

const siteUrl = 'https://zaitsev-pomodoro.vercel.app'
const portfolioUrl = 'https://zaitsevwebdevportfolio.vercel.app/'
const supportUrl = 'https://www.buymeacoffee.com/zaitsevwebdev'

const title = 'Про проєкт і автора Олександра Зайцева | Zaitsev.Pomodoro'
const description =
  'Познайомтеся із Zaitsev.Pomodoro та його автором Олександром Зайцевим. Для чого створено таймер, як влаштований проєкт і що планується далі.'

const canonicalUrl = computed(() => `${siteUrl}${route.path}`)

const technologies = ['Nuxt 4', 'Vue 3', 'TypeScript', 'SCSS']

const projectItems = [
  {
    number: '01',
    label: 'Призначення',
    title: 'Відкрити й почати',
    description:
      'Zaitsev.Pomodoro - таймер для роботи й навчання. Оберіть задачу, запустіть робочий інтервал і зробіть перерву після його завершення. Для початку не потрібен обліковий запис.',
  },
  {
    number: '02',
    label: 'Керування',
    title: 'Потрібне під рукою',
    description:
      'Робочий інтервал, коротка й довга перерви, пауза, скидання та пропуск етапу. Основними діями можна керувати з клавіатури, а Focus mode відкриває таймер на весь екран у браузерах із підтримкою цього режиму.',
  },
  {
    number: '03',
    label: 'Розробка',
    title: 'Власний вебпроєкт',
    description:
      'Інтерфейс побудований на Nuxt 4 та Vue 3, логіка написана на TypeScript, стилі - на SCSS. Я самостійно працюю над кодом, виглядом сторінок і подальшим розвитком продукту.',
  },
  {
    number: '04',
    label: 'У планах',
    title: 'Більше власного ритму',
    description:
      'Планую додати атмосферні теми та розширити можливості роботи з інтервалами. Це майбутні оновлення: строки й остаточний набір функцій поки не визначені.',
  },
]

useSeoMeta({
  title,
  description,
  author: 'Олександр Зайцев',
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

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${siteUrl}/#author`,
      name: 'Олександр Зайцев',
      url: portfolioUrl,
      jobTitle: 'Frontend-розробник',
      knowsAbout: ['Vue.js', 'Nuxt', 'TypeScript', 'SCSS'],
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: 'Zaitsev.Pomodoro',
      alternateName: 'ZΛITSEV.POMODORO',
      inLanguage: 'uk',
      creator: {
        '@id': `${siteUrl}/#author`,
      },
    },
    {
      '@type': 'AboutPage',
      '@id': `${canonicalUrl.value}#webpage`,
      url: canonicalUrl.value,
      name: title,
      description,
      inLanguage: 'uk',
      isPartOf: {
        '@id': `${siteUrl}/#website`,
      },
      about: [
        { '@id': `${siteUrl}/#website` },
        { '@id': `${siteUrl}/#author` },
      ],
      author: {
        '@id': `${siteUrl}/#author`,
      },
    },
  ],
}))

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
  script: [
    {
      key: 'about-structured-data',
      type: 'application/ld+json',
      textContent: JSON.stringify(structuredData.value).replace(/</g, '\\u003c'),
    },
  ],
}))
</script>

<template>
  <main class="about-project">
    <div class="about-project__container">
      <header class="about-project__intro">
        <p class="about-project__eyebrow">Про проєкт і автора</p>

        <h1 class="about-project__title">
          Про Zaitsev.Pomodoro
          <span>та людину за таймером.</span>
        </h1>

        <p class="about-project__description">
          Інструмент для роботи й навчання з короткими перервами.
          Самостійний проєкт Олександра Зайцева - від першого рядка
          коду до того, що ви бачите на екрані.
        </p>

        <NuxtLink to="/" class="about-project__text-link">
          Відкрити Pomodoro таймер
          <span aria-hidden="true">↗</span>
        </NuxtLink>
      </header>

      <section
        class="about-project__author"
        aria-labelledby="about-author"
      >
        <div>
          <p class="about-project__eyebrow">Познайомимося</p>

          <h2 id="about-author" class="about-project__section-title">
            Привіт,<br>
            я Олександр Зайцев.
          </h2>

          <p class="about-project__role">Frontend-розробник</p>

          <ul class="about-project__technologies" aria-label="Технології проєкту">
            <li
              v-for="technology in technologies"
              :key="technology"
              class="about-project__tag"
            >
              {{ technology }}
            </li>
          </ul>
        </div>

        <div class="about-project__story">
          <p>
            Я працюю з Vue, Nuxt і TypeScript. Zaitsev.Pomodoro
            створив самостійно: розробляю інтерфейс, пишу логіку
            інструментів і поступово допрацьовую проєкт.
          </p>

          <p>
            Тут можна побачити мою роботу в дії - від поведінки
            кнопок до адаптації сторінок для телефона.
            Мені важливо, щоб людина могла відкрити таймер
            і розібратися з ним без довгої інструкції.
          </p>

          <p>
            Інші мої роботи зібрані в портфоліо.
            Якщо хочете познайомитися з ними - зазирніть.
          </p>

          <a
            :href="portfolioUrl"
            class="about-project__text-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Переглянути портфоліо
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <section
        class="about-project__section"
        aria-labelledby="about-project-details"
      >
        <header class="about-project__heading">
          <p class="about-project__eyebrow">Як влаштований проєкт</p>

          <h2
            id="about-project-details"
            class="about-project__section-title"
          >
            Зрозумілий таймер.<br>
            Продумані дрібниці.
          </h2>

          <p class="about-project__lead">
            Для чого він потрібен, що вже доступно
            й над чим я планую працювати далі.
          </p>
        </header>

        <div class="about-project__grid">
          <article
            v-for="item in projectItems"
            :key="item.number"
            class="about-project__card"
          >
            <div class="about-project__card-top">
              <span class="about-project__number" aria-hidden="true">
                {{ item.number }}
              </span>

              <span class="about-project__tag">
                {{ item.label }}
              </span>
            </div>

            <h3 class="about-project__card-title">
              {{ item.title }}
            </h3>

            <p class="about-project__card-description">
              {{ item.description }}
            </p>
          </article>
        </div>
      </section>

      <section
        class="about-project__support"
        aria-labelledby="about-support"
      >
        <div>
          <p class="about-project__eyebrow">Підтримка</p>

          <h2 id="about-support" class="about-project__section-title">
            Подобається проєкт?
          </h2>
        </div>

        <div class="about-project__story">
          <p>
            Якщо таймер став частиною вашого робочого дня
            й ви хочете підтримати мою роботу, можна пригостити
            мене кавою через Buy Me a Coffee.
          </p>

          <p>
            Це добровільна підтримка.
            Користуватися таймером можна без неї.
          </p>

          <a
            :href="supportUrl"
            class="about-project__button about-project__button--secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Підтримати проєкт

            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M5 8H16V14A5 5 0 0 1 11 19H10A5 5 0 0 1 5 14V8Z"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linejoin="round"
              />
              <path
                d="M16 10H18A2 2 0 0 1 18 14H16M8 4V6M11 4V6M14 4V6"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
              />
            </svg>
          </a>
        </div>
      </section>

      <section
        class="about-project__cta"
        aria-labelledby="about-cta"
      >
        <span class="about-project__cta-mark" aria-hidden="true">Λ</span>

        <p class="about-project__cta-intro">
          Тепер ми трохи знайомі :)
        </p>

        <h2 id="about-cta" class="about-project__cta-title">
          Гайда до вашої задачі!
        </h2>

        <p class="about-project__cta-description">
          Відкрийте таймер і почніть із 25 хвилин.
        </p>

        <NuxtLink
          to="/"
          class="about-project__button about-project__button--primary"
        >
          Так, почнімо!

          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M7 17L17 7M7 7H17V17"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </NuxtLink>
      </section>
    </div>
  </main>
</template>

<style scoped lang="scss">
  .about-project {
    width: 100%;
    padding: 40px 20px 64px;
    background: $color-bg;
    color: $color-text;
    font-family: $mainFontName;

    @include breakpoint($tablet) {
      padding: 64px 24px 96px;
    }

    &,
    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    &__container {
      width: 100%;
      max-width: 1112px;
      margin-inline: auto;
    }

    &__intro {
      padding-block: 8px 40px;

      @include breakpoint($tablet) {
        padding-block: 16px 64px;
      }
    }

    &__eyebrow {
      margin: 0 0 16px;
      color: $color-primary;
      font-size: 11px;
      font-weight: 700;
      line-height: 1.5;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    &__title {
      max-width: 960px;
      margin: 0;
      font-size: 34px;
      font-weight: 600;
      line-height: 1.12;
      letter-spacing: -0.045em;
      overflow-wrap: break-word;
      text-wrap: balance;

      @include breakpoint($mobile) {
        font-size: 40px;
      }

      @include breakpoint($tablet) {
        font-size: 48px;
      }

      @include breakpoint($tabletLandscape) {
        font-size: 58px;
      }

      @include breakpoint($laptop) {
        font-size: 64px;
      }

      span {
        display: block;
        margin-top: 8px;
        color: $color-text-secondary;
      }
    }

    &__description {
      max-width: 680px;
      margin: 24px 0 0;
      font-size: 16px;
      line-height: 1.8;

      @include breakpoint($tablet) {
        margin-top: 28px;
        font-size: 17px;
      }
    }

    &__text-link {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      min-height: 44px;
      margin-top: 20px;
      color: $color-text;
      font-size: 14px;
      font-weight: 500;
      line-height: 1.6;
      text-decoration: underline;
      text-decoration-color: $color-primary;
      text-underline-offset: 6px;

      span {
        color: $color-primary;
        text-decoration: none;
      }

      &:hover {
        text-decoration-thickness: 2px;
      }
    }

    &__author,
    &__support {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      align-items: start;
      gap: 28px;
      padding-top: 32px;
      border-top: 1px solid $color-border;

      @include breakpoint($tablet) {
        grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
        gap: 32px;
        padding-top: 40px;
      }

      @include breakpoint($tabletLandscape) {
        gap: 48px;
      }
    }

    &__section-title {
      max-width: 760px;
      margin: 0;
      font-size: 26px;
      font-weight: 600;
      line-height: 1.18;
      letter-spacing: -0.035em;
      text-wrap: balance;

      @include breakpoint($tablet) {
        font-size: 32px;
      }

      @include breakpoint($laptop) {
        font-size: 40px;
      }
    }

    &__role {
      margin: 20px 0 0;
      color: $color-text-secondary;
      font-size: 14px;
      line-height: 1.6;
    }

    &__technologies {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 20px 0 0;
      padding: 0;
      list-style: none;
    }

    &__tag {
      display: inline-block;
      padding: 6px 10px;
      background: $color-bg;
      border: 1px solid $color-border;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 500;
      line-height: 1.5;
    }

    &__story {
      min-width: 0;

      p {
        margin: 0;
        font-size: 16px;
        line-height: 1.8;
      }

      p + p {
        margin-top: 18px;
      }

      .about-project__button {
        margin-top: 24px;
      }
    }

    &__section {
      margin-top: 48px;

      @include breakpoint($tablet) {
        margin-top: 72px;
      }
    }

    &__heading {
      margin-bottom: 28px;
    }

    &__lead {
      max-width: 620px;
      margin: 18px 0 0;
      font-size: 16px;
      line-height: 1.7;
    }

    &__grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 18px;

      @include breakpoint($tablet) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    &__card {
      min-width: 0;
      padding: 24px;
      background: $color-surface;
      border: 1px solid $color-border;
      border-radius: 18px;

      @include breakpoint($tablet) {
        padding: 30px;
      }
    }

    &__card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    &__number {
      color: $color-primary;
      font-size: 32px;
      font-weight: 500;
      line-height: 1;
      letter-spacing: -0.05em;
      font-variant-numeric: tabular-nums;
    }

    &__card-title {
      margin: 28px 0 14px;
      font-size: 21px;
      font-weight: 600;
      line-height: 1.3;
      letter-spacing: -0.025em;

      @include breakpoint($tabletLandscape) {
        font-size: 24px;
      }

      @include breakpoint($laptop) {
        font-size: 26px;
      }
    }

    &__card-description {
      margin: 0;
      font-size: 15px;
      line-height: 1.8;
    }

    &__support {
      margin-top: 48px;

      @include breakpoint($tablet) {
        margin-top: 72px;
      }
    }

    &__button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 14px;
      width: 100%;
      min-height: 52px;
      padding: 15px 16px;
      border: 1px solid $color-border;
      border-radius: 12px;
      font: inherit;
      font-size: 14px;
      font-weight: 600;
      line-height: 1.4;
      text-align: center;
      text-decoration: none;
      transition:
        transform 0.2s ease,
        border-color 0.2s ease;

      @include breakpoint($mobile) {
        width: auto;
        padding-inline: 24px;
      }

      svg {
        flex-shrink: 0;
      }

      &--primary {
        color: $color-text-dark;
        background: $color-primary;
        border-color: $color-primary;
      }

      &--secondary {
        color: $color-text;
        background: $color-surface;

        @media (hover: hover) {
          &:hover {
            border-color: $color-primary;
          }
        }
      }

      @media (hover: hover) {
        &:hover {
          transform: translateY(-2px);
        }

        &:active {
          transform: translateY(0);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        transition: none;

        &:hover {
          transform: none;
        }
      }
    }

    &__cta {
      position: relative;
      isolation: isolate;
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow: hidden;
      margin-top: 48px;
      padding: 48px 20px;
      background: $color-surface;
      border: 1px solid $color-border;
      border-radius: 20px;
      text-align: center;

      @include breakpoint($tablet) {
        margin-top: 80px;
        padding: 72px 24px;
        border-radius: 28px;
      }

      &::before {
        position: absolute;
        z-index: -1;
        inset: 0;
        background: radial-gradient(
          ellipse at 50% 100%,
          $color-primary,
          transparent 70%
        );
        opacity: 0.08;
        pointer-events: none;
        content: '';
      }

      .about-project__button {
        margin-top: 30px;
      }
    }

    &__cta-mark {
      margin-bottom: 24px;
      color: $color-primary;
      font-size: 32px;
      font-weight: 700;
      line-height: 1;
    }

    &__cta-intro {
      margin: 0 0 12px;
      font-size: 16px;
      line-height: 1.6;
    }

    &__cta-title {
      margin: 0;
      font-size: 32px;
      font-weight: 600;
      line-height: 1.15;
      letter-spacing: -0.04em;
      text-wrap: balance;

      @include breakpoint($tablet) {
        font-size: 42px;
      }

      @include breakpoint($tabletLandscape) {
        font-size: 50px;
      }

      @include breakpoint($laptop) {
        font-size: 56px;
      }
    }

    &__cta-description {
      max-width: 440px;
      margin: 20px 0 0;
      font-size: 15px;
      line-height: 1.7;
    }

    a:focus-visible {
      outline: 2px solid $color-primary;
      outline-offset: 5px;
      border-radius: 4px;
    }
  }
</style>