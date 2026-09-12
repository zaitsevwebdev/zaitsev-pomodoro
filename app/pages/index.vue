<script setup lang="ts">
import PomodoroTimer from '~/components/PomodoroTimer.vue'

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://zaitsev-pomodoro.vercel.app/#website',
  url: 'https://zaitsev-pomodoro.vercel.app/',
  name: 'Zaitsev.Pomodoro',
  alternateName: 'ZΛITSEV.POMODORO',
  inLanguage: 'uk',
}

const title = 'Таймер Помодоро онлайн для роботи й навчання | Zaitsev.Pomodoro'

const description =
  'Безкоштовний таймер Помодоро: налаштовуйте час роботи й перерв, обирайте тему та вмикайте автозапуск інтервалів. Без реєстрації.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogSiteName: 'Zaitsev.Pomodoro',
  ogType: 'website',
  ogLocale: 'uk_UA',
  ogUrl: 'https://zaitsev-pomodoro.vercel.app/',
  twitterCard: 'summary',
  twitterTitle: title,
  twitterDescription: description,
})

useHead({
  script: [
    {
      key: 'website-schema',
      type: 'application/ld+json',
      textContent: JSON.stringify(websiteSchema),
    },
  ],
})

const heroElement = ref<HTMLElement | null>(null)
const guideElement = ref<HTMLElement | null>(null)
const heroOffset = ref(0)

const updateHeroOffset = () => {
  if (!heroElement.value) return

  heroOffset.value = Math.max(
    0,
    heroElement.value.getBoundingClientRect().top + window.scrollY,
  )
}

const scrollToSection = (element: HTMLElement | null) => {
  if (!element) return

  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches

  element.focus({ preventScroll: true })
  element.scrollIntoView({
    behavior: reducedMotion ? 'instant' : 'smooth',
    block: 'start',
  })
}

onMounted(() => {
  updateHeroOffset()
  window.addEventListener('resize', updateHeroOffset)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateHeroOffset)
})
</script>

<template>
  <div class="pomodoro-page">
    <section
      id="pomodoro-timer"
      ref="heroElement"
      class="pomodoro-page__hero"
      :style="{ '--hero-offset': `${heroOffset}px` }"
      tabindex="-1"
      aria-label="Pomodoro таймер"
    >
      <div class="pomodoro-page__timer">
        <PomodoroTimer />
      </div>

      <button
        class="pomodoro-page__scroll"
        type="button"
        aria-label="Дізнатися про метод Pomodoro"
        @click="scrollToSection(guideElement)"
      >
        <span>SCROLL</span>

        <svg
          class="pomodoro-page__scroll-arrow"
          width="24"
          height="32"
          viewBox="0 0 24 32"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 3V27M5 20L12 27L19 20"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </section>

    <div
      id="pomodoro-guide"
      ref="guideElement"
      class="pomodoro-guide"
      tabindex="-1"
    >
      <section
        class="pomodoro-guide__about"
        aria-labelledby="pomodoro-about"
      >
        <div>
          <p class="pomodoro-guide__eyebrow">Про метод</p>

          <h2 id="pomodoro-about" class="pomodoro-guide__title">
            Одна задача.<br>
            Час на роботу й перерву.
          </h2>
        </div>

        <div class="pomodoro-guide__story">
          <p>
            Pomodoro - це спосіб організувати роботу інтервалами.
            Ви обираєте задачу, працюєте до завершення відліку,
            а потім робите перерву.
          </p>

          <p>
            Наприкінці 1980-х Франческо Чірілло розробив цей метод,
            коли був студентом. Він шукав спосіб організувати навчання
            й менше відволікатися. Назву дав кухонний таймер у формі
            помідора: італійською - pomodoro.
            <a
              href="https://en.wikipedia.org/wiki/Pomodoro_Technique"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Джерело: історія методу Pomodoro"
            >[1]</a>
          </p>

          <p>
            У ZΛITSEV.POMODORO цей ритм складається з 25 хвилин роботи,
            коротких перерв на 5 хвилин і довгої перерви на 15 хвилин.
          </p>
        </div>
      </section>

      <section
        class="pomodoro-guide__section"
        aria-labelledby="pomodoro-start"
      >
        <header class="pomodoro-guide__heading">
          <p class="pomodoro-guide__eyebrow">Як почати</p>

          <h2 id="pomodoro-start" class="pomodoro-guide__title">
            Перші 25 хвилин - за чотири кроки
          </h2>

          <p class="pomodoro-guide__lead">
            Підготуйте задачу. Решту часу відміряє таймер.
          </p>
        </header>

        <ol class="pomodoro-guide__steps">
          <li class="pomodoro-guide__step">
            <div class="pomodoro-guide__step-top">
              <span class="pomodoro-guide__number" aria-hidden="true">01</span>
              <span class="pomodoro-guide__tag">Підготовка</span>
            </div>

            <h3>Оберіть один крок</h3>

            <p>
              Запишіть, над чим працюватимете: прочитати розділ,
              скласти план тексту або виправити помилку в коді.
              Приберіть зайві вкладки й відкладіть повідомлення.
            </p>
          </li>

          <li class="pomodoro-guide__step">
            <div class="pomodoro-guide__step-top">
              <span class="pomodoro-guide__number" aria-hidden="true">02</span>
              <span class="pomodoro-guide__tag">Focus · 25 хв</span>
            </div>

            <h3>Натисніть Start</h3>

            <p>
              Працюйте над обраною задачею до завершення відліку.
              Якщо згадаєте про іншу справу, коротко запишіть її
              й поверніться до поточної.
            </p>
          </li>

          <li class="pomodoro-guide__step">
            <div class="pomodoro-guide__step-top">
              <span class="pomodoro-guide__number" aria-hidden="true">03</span>
              <span class="pomodoro-guide__tag">Short break · 5 хв</span>
            </div>

            <h3>Зробіть перерву</h3>

            <p>
              Таймер обере Short break - натисніть Start.
              Відкладіть роботу: можна встати, пройтися або налити води.
              Після перерви запустіть наступний Focus.
            </p>
          </li>

          <li class="pomodoro-guide__step">
            <div class="pomodoro-guide__step-top">
              <span class="pomodoro-guide__number" aria-hidden="true">04</span>
              <span class="pomodoro-guide__tag">Long break · 15 хв</span>
            </div>

            <h3>Завершіть цикл</h3>

            <p>
              Після четвертого робочого інтервалу таймер обере
              Long break. Запустіть довгу перерву.
              Перед наступним циклом перегляньте зроблене
              й визначте наступну задачу.
            </p>
          </li>
        </ol>

        <p class="pomodoro-guide__hint">
          Кожен інтервал запускається кнопкою Start.
          Pause призупиняє відлік, Reset скидає час,
          а Skip пропускає поточний етап.
        </p>
      </section>

      <section
        class="pomodoro-guide__section"
        aria-labelledby="pomodoro-research"
      >
        <header class="pomodoro-guide__heading">
          <p class="pomodoro-guide__eyebrow">Що відомо з досліджень</p>

          <h2 id="pomodoro-research" class="pomodoro-guide__title">
            Навіщо залишати час на перерви
          </h2>

          <p class="pomodoro-guide__lead">
            Дослідження коротких перерв дають підстави включати
            відпочинок у робочий день. Ось що саме вони показують.
          </p>
        </header>

        <div class="pomodoro-guide__findings">
          <article class="pomodoro-guide__finding">
            <span class="pomodoro-guide__label">Втома</span>

            <h3>Короткі паузи можуть зменшувати втому</h3>

            <p>
              Метааналіз 2022 року об’єднав 22 незалежні вибірки -
              загалом 2335 учасників. Перерви тривалістю до 10 хвилин
              мали невеликий, але статистично значущий ефект:
              знижували втому та підвищували відчуття бадьорості.
            </p>

            <a
              class="pomodoro-guide__source"
              href="https://doi.org/10.1371/journal.pone.0272460"
              target="_blank"
              rel="noopener noreferrer"
            >
              Albulescu та ін., 2022 ↗
            </a>
          </article>

          <article class="pomodoro-guide__finding">
            <span class="pomodoro-guide__label">Результативність</span>

            <h3>Більше відпочинку не означає автоматично більше зробленого</h3>

            <p>
              У тому самому метааналізі загальне покращення
              результативності не було статистично значущим.
              Користь для самопочуття не варто перетворювати
              на обіцянку працювати швидше чи виконувати більше задач.
            </p>

            <a
              class="pomodoro-guide__source"
              href="https://doi.org/10.1371/journal.pone.0272460"
              target="_blank"
              rel="noopener noreferrer"
            >
              Результати метааналізу ↗
            </a>
          </article>
        </div>

        <p class="pomodoro-guide__note">
          Це дані про короткі перерви, а не перевірка саме цього таймера.
          Вони не доводять, що інтервали 25/5 - найкращий режим для всіх.
        </p>
      </section>

      <section
        class="pomodoro-guide__try"
        aria-labelledby="pomodoro-try"
      >
        <div>
          <p class="pomodoro-guide__eyebrow">Спробуйте на своїй задачі</p>

          <h2 id="pomodoro-try" class="pomodoro-guide__title">
            Навіщо освоювати цей ритм?
          </h2>
        </div>

        <div class="pomodoro-guide__story">
          <p>
            Практичний сенс Pomodoro - заздалегідь визначити,
            над чим ви працюєте й коли зупиняєтеся на відпочинок.
            У ZΛITSEV.POMODORO для цього вже є три режими
            й лічильник робочих сесій.
          </p>

          <p>
            Почніть з одного інтервалу. Після нього оцініть:
            що вдалося зробити, як часто ви відволікалися
            й чи зручно було працювати в такому темпі.
            Це спосіб перевірити, чи підходить метод саме вам.
          </p>
        </div>
      </section>

      <section
        class="pomodoro-page__cta"
        aria-labelledby="pomodoro-cta-title"
      >
        <span class="pomodoro-page__cta-mark" aria-hidden="true">Λ</span>

        <p class="pomodoro-page__cta-intro">
          Ну що, зацікавилися? :)
        </p>

        <h2 id="pomodoro-cta-title" class="pomodoro-page__cta-title">
          Гайда починати!
        </h2>

        <p class="pomodoro-page__cta-description">
          Оберіть одну задачу. Почнімо з 25 хвилин.
        </p>

        <button
          class="pomodoro-page__cta-button"
          type="button"
          @click="scrollToSection(heroElement)"
        >
          Так, звісно!

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
        </button>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .pomodoro-page {
    background: $color-bg;
    color: $color-text;
    font-family: $mainFontName;

    &,
    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    &__hero {
      display: flex;
      flex-direction: column;
      min-height: calc(100svh - var(--hero-offset, 0px));
      padding-bottom: max(20px, env(safe-area-inset-bottom));
      scroll-margin-top: var(--hero-offset, 0px);

      &:focus {
        outline: none;
      }
    }

    &__timer {
      display: flex;
      flex: 1;
      align-items: center;
      width: 100%;
      padding-block: 24px;

      :deep(.pomodoro-timer:not(:fullscreen)) {
        box-sizing: border-box;
        width: 100%;
        min-height: 0;
        padding: 24px 14px;
      }
    }

    &__scroll {
      display: flex;
      flex-direction: column;
      align-items: center;
      align-self: center;
      flex-shrink: 0;
      gap: 10px;
      padding: 12px 20px;
      color: $color-text-secondary;
      background: transparent;
      border: 0;
      border-radius: 12px;
      font: inherit;
      font-size: 10px;
      font-weight: 600;
      line-height: 1.4;
      letter-spacing: 0.22em;
      cursor: pointer;
      transition: color 0.2s ease;

      &:hover {
        color: $color-primary;
      }

      &:focus-visible {
        outline: 2px solid $color-primary;
        outline-offset: 4px;
      }

      @media (prefers-reduced-motion: reduce) {
        transition: none;
      }
    }

    &__scroll-arrow {
      color: $color-primary;
      animation: pomodoro-scroll-arrow 1.8s ease-in-out infinite;

      @media (prefers-reduced-motion: reduce) {
        animation: none;
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
      font-size: clamp(32px, 5vw, 56px);
      font-weight: 600;
      line-height: 1.15;
      letter-spacing: -0.04em;
      text-wrap: balance;
    }

    &__cta-description {
      max-width: 400px;
      margin: 20px 0 0;
      font-size: 15px;
      line-height: 1.7;
    }

    &__cta-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      min-height: 52px;
      margin-top: 30px;
      padding: 15px 26px;
      color: $color-text-dark;
      background: $color-primary;
      border: 1px solid transparent;
      border-radius: 12px;
      font: inherit;
      font-size: 15px;
      font-weight: 600;
      line-height: 1.4;
      cursor: pointer;
      transition: transform 0.2s ease;

      svg {
        flex-shrink: 0;
        transition: transform 0.2s ease;

        @media (prefers-reduced-motion: reduce) {
          transition: none;
        }
      }

      @media (hover: hover) {
        &:hover {
          transform: translateY(-2px);

          svg {
            transform: translate(2px, -2px);
          }
        }
      }

      &:active {
        transform: translateY(0);
      }

      &:focus-visible {
        outline: 2px solid $color-primary;
        outline-offset: 5px;
      }

      @media (prefers-reduced-motion: reduce) {
        transition: none;

        &:hover,
        &:hover svg {
          transform: none;
        }
      }
    }
  }

  .pomodoro-guide {
    width: 100%;
    max-width: 1160px;
    margin-inline: auto;
    padding: 20px 20px 64px;
    color: $color-text;
    font-family: $mainFontName;

    @include breakpoint($tablet) {
      padding: 32px 24px 96px;
    }

    &:focus {
      outline: none;
    }

    &__about,
    &__try {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      align-items: start;
      gap: 32px;

      @include breakpoint($tablet) {
        grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
      }

      @include breakpoint($tabletLandscape) {
        gap: 48px;
      }
    }

    &__about {
      padding-block: 32px;
      border-top: 1px solid $color-border;
      border-bottom: 1px solid $color-border;

      @include breakpoint($tablet) {
        padding-block: 40px 56px;
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
      max-width: 760px;
      margin: 0;
      font-size: clamp(26px, 3.2vw, 40px);
      font-weight: 600;
      line-height: 1.18;
      letter-spacing: -0.035em;
      text-wrap: balance;
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

      a {
        color: inherit;
        text-decoration-color: $color-primary;
        text-underline-offset: 4px;
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
      max-width: 680px;
      margin: 18px 0 0;
      font-size: 16px;
      line-height: 1.7;
    }

    &__steps {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 14px;
      margin: 0;
      padding: 0;
      list-style: none;

      @include breakpoint($mobile) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      @include breakpoint($tabletLandscape) {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }
    }

    &__step {
      min-width: 0;
      padding: 24px;
      background: $color-surface;
      border: 1px solid $color-border;
      border-radius: 18px;

      @include breakpoint($mobile) {
        padding: 24px 20px;
      }

      h3 {
        margin: 20px 0 12px;
        font-size: 19px;
        font-weight: 600;
        line-height: 1.35;
        letter-spacing: -0.02em;

        @include breakpoint($mobile) {
          margin-top: 28px;
        }
      }

      p {
        margin: 0;
        font-size: 14px;
        line-height: 1.8;
      }
    }

    &__step-top {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 12px;

      @include breakpoint($mobile) {
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        gap: 18px;
      }
    }

    &__number {
      color: $color-primary;
      font-size: 32px;
      font-weight: 500;
      line-height: 1;
      letter-spacing: -0.05em;
      font-variant-numeric: tabular-nums;
    }

    &__tag {
      display: inline-block;
      padding: 6px 9px;
      background: $color-bg;
      border: 1px solid $color-border;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 500;
      line-height: 1.4;
    }

    &__hint {
      margin: 18px 0 0;
      font-size: 13px;
      line-height: 1.8;
    }

    &__findings {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 18px;

      @include breakpoint($tablet) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    &__finding {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      min-width: 0;
      padding: 24px;
      background: $color-surface;
      border: 1px solid $color-border;
      border-radius: 18px;

      @include breakpoint($tablet) {
        padding: 30px;
      }

      h3 {
        margin: 16px 0 14px;
        font-size: clamp(20px, 2vw, 24px);
        font-weight: 600;
        line-height: 1.35;
        letter-spacing: -0.025em;
      }

      p {
        margin: 0 0 24px;
        font-size: 15px;
        line-height: 1.8;
      }
    }

    &__label {
      color: $color-primary;
      font-size: 11px;
      font-weight: 600;
      line-height: 1.5;
      letter-spacing: 0.09em;
      text-transform: uppercase;
    }

    &__source {
      margin-top: auto;
      color: inherit;
      font-size: 13px;
      line-height: 1.6;
      text-decoration: underline;
      text-decoration-color: $color-primary;
      text-underline-offset: 5px;
      overflow-wrap: anywhere;

      &:hover {
        text-decoration-thickness: 2px;
      }
    }

    &__note {
      margin: 20px 0 0;
      padding-left: 16px;
      border-left: 2px solid $color-primary;
      font-size: 13px;
      line-height: 1.8;
    }

    &__try {
      margin-top: 48px;
      padding-top: 40px;
      border-top: 1px solid $color-border;

      @include breakpoint($tablet) {
        margin-top: 72px;
      }
    }

    a:focus-visible {
      outline: 2px solid $color-primary;
      outline-offset: 5px;
      border-radius: 2px;
    }
  }

  @keyframes pomodoro-scroll-arrow {
    0%,
    100% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(7px);
    }
  }
</style>