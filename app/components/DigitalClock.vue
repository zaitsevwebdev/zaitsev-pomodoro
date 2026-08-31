<script setup lang="ts">
const timeZone = 'Europe/Kyiv'
const worldClockCities = ['Kyiv', 'London', 'New York', 'Tokyo'] as const

const currentDate = ref<Date | null>(null)
const clockElement = ref<HTMLElement | null>(null)
const isFullscreen = ref(false)

let timeoutId: ReturnType<typeof setTimeout> | null = null
let originalDocumentTitle = ''

const formattedTime = computed(() => {
  if (!currentDate.value) {
    return '00:00:00'
  }

  return new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(currentDate.value)
})

const formattedWeekday = computed(() => {
  if (!currentDate.value) {
    return ''
  }

  return new Intl.DateTimeFormat('en-GB', {
    timeZone,
    weekday: 'long'
  }).format(currentDate.value)
})

const formattedDate = computed(() => {
  if (!currentDate.value) {
    return ''
  }

  return new Intl.DateTimeFormat('en-GB', {
    timeZone,
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(currentDate.value)
})

const handleScheduleTick = () => {
  currentDate.value = new Date()
  const delayUntilNextSecond = 1000 - (Date.now() % 1000)
  timeoutId = setTimeout(handleScheduleTick, delayUntilNextSecond)
}

const handleStopClock = () => {
  if (timeoutId === null) {
    return
  }

  clearTimeout(timeoutId)
  timeoutId = null
}

const handleFullscreen = async () => {
  if (!clockElement.value) {
    return
  }

  if (document.fullscreenElement) {
    await document.exitFullscreen()
    return
  }

  await clockElement.value.requestFullscreen()
}

const handleFullscreenChange = () => {
  isFullscreen.value = document.fullscreenElement === clockElement.value
}

const handleKeydown = (event: KeyboardEvent) => {
  const target = event.target

  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) {
    return
  }

  if (event.key.toLowerCase() === 'f') {
    void handleFullscreen()
  }
}

watch(formattedTime, (time) => {
  if (import.meta.client && currentDate.value) {
    document.title = `${time} - Kyiv Clock`
  }
})

onMounted(() => {
  originalDocumentTitle = document.title
  handleScheduleTick()
  window.addEventListener('keydown', handleKeydown)
  document.addEventListener('fullscreenchange', handleFullscreenChange)
})

onBeforeUnmount(() => {
  handleStopClock()
  document.title = originalDocumentTitle
  window.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
})
</script>

<template>
  <main
    ref="clockElement"
    class="digital-clock"
  >
    <div class="digital-clock__container">
      <p class="digital-clock__location">
        Local time · {{ timeZone }}
      </p>

      <time class="digital-clock__time">
        {{ formattedTime }}
      </time>

      <p class="digital-clock__weekday">
        {{ formattedWeekday }}
      </p>

      <p class="digital-clock__date">
        {{ formattedDate }}
      </p>

      <button
        class="digital-clock__fullscreen"
        type="button"
        :aria-label="isFullscreen ? 'Вийти з повноекранного режиму' : 'Відкрити годинник на весь екран'"
        @click="handleFullscreen"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 4H4V9M15 4H20V9M9 20H4V15M15 20H20V15" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        {{ isFullscreen ? 'Exit fullscreen' : 'Fullscreen clock' }}
      </button>

      <section
        class="digital-clock__world-clock"
        aria-labelledby="world-clock-title"
      >
        <h2
          id="world-clock-title"
          class="digital-clock__world-clock-title"
        >
          World clock · Coming next
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
  </main>
</template>

<style scoped lang="scss">
.digital-clock {
  @include flexCenter;
  width: 100%;
  min-height: calc(100svh - 160px);
  padding: 90px 8px;
  background: $color-bg;

  &__container {
    @include flexCenter;
    width: 100%;
    max-width: 474px;
    flex-direction: column;
  }

  &__location {
    margin: 0;
    text-align: center;
    letter-spacing: 2px;
    @include font(9px, 1.3, $mainFontName, $color-primary, 800);
  }

  &__time {
    display: block;
    margin-top: 32px;
    white-space: nowrap;
    letter-spacing: -5px;
    font-variant-numeric: tabular-nums;
    @include font(52px, 1, $mainFontName, $color-text, 300);

    @include breakpoint($mobile) {
      @include font(88px, 1, $mainFontName, $color-text, 300);
    }

    @include breakpoint($tablet) {
      @include font(126px, 1, $mainFontName, $color-text, 300);
    }
  }

  &__weekday {
    margin: 22px 0 0;
    @include font(16px, 1.2, $mainFontName, $color-text, 600);

    @include breakpoint($tablet) {
      @include font(17px, 1.2, $mainFontName, $color-text, 600);
    }
  }

  &__date {
    margin: 10px 0 0;
    @include font(13px, 1.3, $mainFontName, $color-text-secondary, 400);
  }

  &__fullscreen {
    @include flex(center, center);
    gap: 6px;
    margin-top: 20px;
    padding: 5px;
    background: transparent;
    border: 0;
    cursor: pointer;
    @include font(9px, 1.2, $mainFontName, $color-text-secondary, 400);
    transition: color 0.2s ease;

    &:hover {
      color: $color-text;
    }

    &:focus-visible {
      color: $color-primary;
      outline: 2px solid $color-primary;
      outline-offset: 2px;
    }
  }

  &__world-clock {
    width: 100%;
    margin-top: 42px;
    padding: 25px 0 0;
    border-top: 1px solid $color-border;
  }

  &__world-clock-title {
    margin: 0;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 2px;
    @include font(7px, 1.3, $mainFontName, $color-text-secondary, 400);
  }

  &__cities {
    @include flex(center, center);
    flex-wrap: wrap;
    gap: 12px;
    margin: 8px 0 0;
    padding: 0;
    list-style: none;
  }

  &__city {
    @include font(9px, 1.3, $mainFontName, $color-text-secondary, 400);
  }

  &:fullscreen {
    min-height: 100vh;
  }

  &:fullscreen &__world-clock {
    display: none;
  }
}
</style>
