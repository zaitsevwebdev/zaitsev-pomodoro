<script setup lang="ts">
const timeZone = 'Europe/Kyiv'
const worldClockCities = ['Київ', 'Лондон', 'Нью-Йорк', 'Токіо']

const currentDate = ref<Date | null>(null)
const clockElement = ref<HTMLElement | null>(null)
const isFullscreen = ref(false)
const canFullscreen = ref(false)
const fullscreenError = ref('')

let timeoutId: ReturnType<typeof setTimeout> | null = null

const timeFormatter = new Intl.DateTimeFormat('uk-UA', {
  timeZone,
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
})

const weekdayFormatter = new Intl.DateTimeFormat('uk-UA', {
  timeZone,
  weekday: 'long',
})

const dateFormatter = new Intl.DateTimeFormat('uk-UA', {
  timeZone,
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const formattedTime = computed(() =>
  currentDate.value
    ? timeFormatter.format(currentDate.value)
    : '--:--:--',
)

const formattedWeekday = computed(() =>
  currentDate.value
    ? weekdayFormatter.format(currentDate.value)
    : '',
)

const formattedDate = computed(() =>
  currentDate.value
    ? dateFormatter.format(currentDate.value)
    : '',
)

const dateTime = computed(() => currentDate.value?.toISOString())

const handleStopClock = () => {
  if (timeoutId === null) return

  clearTimeout(timeoutId)
  timeoutId = null
}

const handleScheduleTick = () => {
  handleStopClock()

  currentDate.value = new Date()

  const delayUntilNextSecond = 1000 - (Date.now() % 1000)
  timeoutId = setTimeout(handleScheduleTick, delayUntilNextSecond)
}

const handleVisibilityChange = () => {
  if (document.hidden) {
    handleStopClock()
    return
  }

  handleScheduleTick()
}

const handleFullscreen = async () => {
  if (!clockElement.value || !canFullscreen.value) return

  fullscreenError.value = ''

  try {
    if (document.fullscreenElement === clockElement.value) {
      await document.exitFullscreen()
      return
    }

    await clockElement.value.requestFullscreen()
  } catch {
    fullscreenError.value =
      'Не вдалося відкрити повноекранний режим. Спробуйте ще раз.'
  }
}

const handleFullscreenChange = () => {
  isFullscreen.value =
    document.fullscreenElement === clockElement.value
}

const handleKeydown = (event: KeyboardEvent) => {
  if (
    event.repeat ||
    event.ctrlKey ||
    event.metaKey ||
    event.altKey ||
    event.key.toLowerCase() !== 'f'
  ) {
    return
  }

  const target = event.target

  if (
    target instanceof HTMLElement &&
    (
      target.isContentEditable ||
      target.closest('input, textarea, select, button, a, [role="button"]')
    )
  ) {
    return
  }

  if (!canFullscreen.value) return

  event.preventDefault()
  void handleFullscreen()
}

onMounted(() => {
  canFullscreen.value = Boolean(
    document.fullscreenEnabled &&
    clockElement.value?.requestFullscreen,
  )

  handleScheduleTick()

  window.addEventListener('keydown', handleKeydown)
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onBeforeUnmount(() => {
  handleStopClock()

  window.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<template>
  <div ref="clockElement" class="digital-clock">
    <div class="digital-clock__container">
      <p class="digital-clock__location">
        Київ · {{ timeZone }}
      </p>

      <time
        class="digital-clock__time"
        :datetime="dateTime"
        aria-live="off"
      >
        {{ formattedTime }}
      </time>

      <p class="digital-clock__weekday">
        {{ formattedWeekday }}
      </p>

      <p class="digital-clock__date">
        {{ formattedDate }}
      </p>

      <button
        v-if="canFullscreen"
        class="digital-clock__fullscreen"
        type="button"
        :aria-pressed="isFullscreen"
        :aria-label="
          isFullscreen
            ? 'Вийти з повноекранного режиму'
            : 'Відкрити годинник на весь екран'
        "
        title="Повноекранний режим (F)"
        @click="handleFullscreen"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M9 4H4V9M15 4H20V9M9 20H4V15M15 20H20V15"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        {{ isFullscreen ? 'Вийти з повного екрана' : 'На весь екран' }}
      </button>

      <p
        v-if="fullscreenError"
        class="digital-clock__error"
        role="status"
      >
        {{ fullscreenError }}
      </p>

      <section
        class="digital-clock__world-clock"
        aria-labelledby="world-clock-title"
      >
        <h2
          id="world-clock-title"
          class="digital-clock__world-clock-title"
        >
          У планах - час в інших містах
        </h2>

        <ul class="digital-clock__cities">
          <li
            v-for="city in worldClockCities"
            :key="city"
            class="digital-clock__city"
          >
            {{ city }}
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .digital-clock {
    @include flexCenter;

    flex: 1;
    width: 100%;
    min-width: 0;
    padding: 40px 0;
    background: $color-bg;
    color: $color-text;
    font-family: $mainFontName;

    @include breakpoint($tablet) {
      padding-block: 48px;
    }

    &,
    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    &__container {
      @include flexCenter;

      flex-direction: column;
      width: 100%;
      max-width: 760px;
      min-width: 0;
    }

    &__location {
      margin: 0;
      color: $color-primary;
      font-size: 10px;
      font-weight: 600;
      line-height: 1.5;
      letter-spacing: 0.12em;
      text-align: center;
    }

    &__time {
      display: block;
      margin-top: 28px;
      font-size: 48px;
      font-weight: 300;
      line-height: 1.1;
      letter-spacing: -0.045em;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;

      @include breakpoint($mobile) {
        font-size: 76px;
      }

      @include breakpoint($tabletSmall) {
        font-size: 100px;
      }

      @include breakpoint($tablet) {
        font-size: 126px;
      }

      @include breakpoint($tabletLandscape) {
        font-size: 144px;
      }
    }

    &__weekday {
      min-height: 24px;
      margin: 20px 0 0;
      font-size: 16px;
      font-weight: 600;
      line-height: 1.5;
      text-align: center;

      &::first-letter {
        text-transform: uppercase;
      }

      @include breakpoint($tablet) {
        font-size: 18px;
        min-height: 27px;
      }
    }

    &__date {
      min-height: 21px;
      margin: 8px 0 0;
      color: $color-text-secondary;
      font-size: 14px;
      line-height: 1.5;
      text-align: center;
    }

    &__fullscreen {
      @include flex(center, center);

      gap: 8px;
      min-height: 44px;
      margin-top: 20px;
      padding: 10px 14px;
      color: $color-text;
      background: $color-surface;
      border: 1px solid $color-border;
      border-radius: 10px;
      font: inherit;
      font-size: 12px;
      line-height: 1.5;
      cursor: pointer;
      transition:
        color 0.2s ease,
        border-color 0.2s ease;

      &:hover {
        color: $color-primary;
        border-color: $color-primary;
      }

      &:focus-visible {
        outline: 2px solid $color-primary;
        outline-offset: 4px;
      }

      @media (prefers-reduced-motion: reduce) {
        transition: none;
      }
    }

    &__error {
      max-width: 400px;
      margin: 12px 0 0;
      font-size: 12px;
      line-height: 1.6;
      text-align: center;
    }

    &__world-clock {
      width: 100%;
      max-width: 474px;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid $color-border;
    }

    &__world-clock-title {
      margin: 0;
      color: $color-text-secondary;
      font-size: 11px;
      font-weight: 500;
      line-height: 1.6;
      text-align: center;
    }

    &__cities {
      @include flex(center, center);

      flex-wrap: wrap;
      gap: 8px;
      margin: 14px 0 0;
      padding: 0;
      list-style: none;
    }

    &__city {
      padding: 5px 9px;
      background: $color-surface;
      border: 1px solid $color-border;
      border-radius: 6px;
      font-size: 11px;
      line-height: 1.5;
    }

    &:fullscreen {
      width: 100%;
      height: 100%;
      min-height: 100svh;
      padding: 24px;
      overflow: auto;
    }

    &:fullscreen &__world-clock {
      display: none;
    }
  }
</style>