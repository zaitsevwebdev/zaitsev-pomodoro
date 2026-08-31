<script setup lang="ts">
const presets = [1, 5, 10, 15, 30, 60] as const

type TimerPreset = (typeof presets)[number]

const selectedPreset = ref<TimerPreset>(10)
const remainingSeconds = ref(selectedPreset.value * 60)
const isRunning = ref(false)
const isFinished = ref(false)

let intervalId: ReturnType<typeof setInterval> | null = null
let endTimestamp = 0
let originalDocumentTitle = ''

const formattedTime = computed(() => {
  const hours = Math.floor(remainingSeconds.value / 3600)
  const minutes = Math.floor((remainingSeconds.value % 3600) / 60)
  const seconds = remainingSeconds.value % 60

  return [hours, minutes, seconds]
    .map(value => String(value).padStart(2, '0'))
    .join(':')
})

const buttonLabel = computed(() => {
  if (isRunning.value) {
    return 'Pause timer'
  }

  return isFinished.value ? 'Restart timer' : 'Start timer'
})

const handleStopInterval = () => {
  if (intervalId === null) {
    return
  }

  clearInterval(intervalId)
  intervalId = null
}

const handlePause = () => {
  handleStopInterval()
  isRunning.value = false
}

const handleComplete = () => {
  handlePause()
  remainingSeconds.value = 0
  isFinished.value = true
}

const handleTick = () => {
  const nextRemainingSeconds = Math.max(0, Math.ceil((endTimestamp - Date.now()) / 1000))
  remainingSeconds.value = nextRemainingSeconds

  if (nextRemainingSeconds === 0) {
    handleComplete()
  }
}

const handleStart = () => {
  if (isRunning.value) {
    return
  }

  if (isFinished.value || remainingSeconds.value === 0) {
    remainingSeconds.value = selectedPreset.value * 60
    isFinished.value = false
  }

  isRunning.value = true
  endTimestamp = Date.now() + remainingSeconds.value * 1000
  intervalId = setInterval(handleTick, 250)
}

const handleToggle = () => {
  if (isRunning.value) {
    handlePause()
    return
  }

  handleStart()
}

const handleReset = () => {
  handlePause()
  remainingSeconds.value = selectedPreset.value * 60
  isFinished.value = false
}

const handleSelectPreset = (preset: TimerPreset) => {
  handlePause()
  selectedPreset.value = preset
  remainingSeconds.value = preset * 60
  isFinished.value = false
}

const handleKeydown = (event: KeyboardEvent) => {
  const target = event.target

  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) {
    return
  }

  if (event.code === 'Space') {
    event.preventDefault()
    handleToggle()
  }

  if (event.key.toLowerCase() === 'r') {
    handleReset()
  }
}

const handleVisibilityChange = () => {
  if (document.visibilityState === 'visible' && isRunning.value) {
    handleTick()
  }
}

watch([formattedTime, isFinished], ([time, finished]) => {
  if (!import.meta.client) {
    return
  }

  document.title = finished ? 'Timer finished' : `${time} - Timer`
})

onMounted(() => {
  originalDocumentTitle = document.title
  window.addEventListener('keydown', handleKeydown)
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onBeforeUnmount(() => {
  handleStopInterval()
  document.title = originalDocumentTitle
  window.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<template>
  <main class="countdown-timer">
    <div class="countdown-timer__container">
      <header class="countdown-timer__header">
        <p class="countdown-timer__eyebrow">Precision countdown</p>
        <h1 class="countdown-timer__title">Timer</h1>
      </header>

      <section
        class="countdown-timer__display"
        aria-label="Зворотний відлік"
      >
        <time
          class="countdown-timer__time"
          :datetime="`PT${remainingSeconds}S`"
        >
          {{ formattedTime }}
        </time>

        <p
          class="countdown-timer__announcement"
          aria-live="polite"
        >
          {{ isFinished ? 'Timer finished' : '' }}
        </p>
      </section>

      <div
        class="countdown-timer__presets"
        role="group"
        aria-label="Оберіть тривалість таймера"
      >
        <button
          v-for="preset in presets"
          :key="preset"
          class="countdown-timer__preset"
          :class="{ 'countdown-timer__preset--active': selectedPreset === preset }"
          type="button"
          :aria-pressed="selectedPreset === preset"
          @click="handleSelectPreset(preset)"
        >
          {{ preset }} min
        </button>
      </div>

      <div class="countdown-timer__controls">
        <button
          class="countdown-timer__reset"
          type="button"
          aria-label="Скинути таймер"
          title="Reset (R)"
          @click="handleReset"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 4V9H9" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M5.3 15A8 8 0 1 0 6 7.1L4 9" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>

        <button
          class="countdown-timer__toggle"
          type="button"
          :aria-label="buttonLabel"
          @click="handleToggle"
        >
          {{ buttonLabel }}
        </button>
      </div>

      <p class="countdown-timer__hint">
        Timestamp-based timing stays accurate when the tab sleeps.
      </p>
    </div>
  </main>
</template>

<style scoped lang="scss">
.countdown-timer {
  @include flexCenter;
  width: 100%;
  min-height: calc(100svh - 160px);
  padding: 80px 6px;
  background: $color-bg;

  &__container {
    @include flexCenter;
    width: 100%;
    max-width: 602px;
    flex-direction: column;
  }

  &__header {
    text-align: center;
  }

  &__eyebrow {
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 3px;
    @include font(9px, 1.2, $mainFontName, $color-primary, 800);
  }

  &__title {
    margin: 14px 0 0;
    @include font(14px, 1.2, $mainFontName, $color-text-secondary, 400);
  }

  &__display {
    position: relative;
    @include flexCenter;
    width: 100%;
    min-height: 136px;
    margin-top: 26px;
    border-top: 1px solid $color-border;
    border-bottom: 1px solid $color-border;

    @include breakpoint($tablet) {
      min-height: 166px;
    }
  }

  &__time {
    display: block;
    white-space: nowrap;
    letter-spacing: -4px;
    font-variant-numeric: tabular-nums;
    @include font(46px, 1, $mainFontName, $color-text, 300);

    @include breakpoint($mobile) {
      @include font(62px, 1, $mainFontName, $color-text, 300);
    }

    @include breakpoint($tablet) {
      @include font(78px, 1, $mainFontName, $color-text, 300);
    }
  }

  &__announcement {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  &__presets {
    @include flex(center, center);
    width: 100%;
    max-width: 350px;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 22px;

    @include breakpoint($mobile) {
      flex-wrap: nowrap;
    }
  }

  &__preset {
    min-width: 50px;
    padding: 9px 10px;
    white-space: nowrap;
    background: $color-bg-secondary;
    border: 1px solid $color-border;
    border-radius: 7px;
    cursor: pointer;
    @include font(9px, 1.2, $mainFontName, $color-text-secondary, 600);
    transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;

    &:hover {
      color: $color-text;
      border-color: $color-text-secondary;
    }

    &:focus-visible {
      outline: 2px solid $color-primary;
      outline-offset: 2px;
    }

    &--active {
      color: $color-primary;
      background: $color-surface;
      border-color: $color-primary;
    }
  }

  &__controls {
    @include flex(center, center);
    gap: 10px;
    margin-top: 22px;
  }

  &__reset {
    @include flexCenter;
    width: 36px;
    height: 36px;
    padding: 0;
    color: $color-text;
    background: $color-surface;
    border: 1px solid $color-border;
    border-radius: 8px;
    cursor: pointer;
    transition: color 0.2s ease, border-color 0.2s ease;

    &:hover {
      color: $color-primary;
      border-color: $color-primary;
    }

    &:focus-visible {
      outline: 2px solid $color-primary;
      outline-offset: 2px;
    }
  }

  &__toggle {
    min-width: 126px;
    padding: 12px 22px;
    background: $color-primary;
    border: 0;
    border-radius: 9px;
    box-shadow: 0 8px 28px $color-primary-dark;
    cursor: pointer;
    @include font(13px, 1.2, $mainFontName, $color-text-dark, 700);
    transition: background 0.2s ease, transform 0.2s ease;

    &:hover {
      background: $color-primary-dark;
    }

    &:active {
      transform: translateY(1px);
    }

    &:focus-visible {
      outline: 2px solid $color-white;
      outline-offset: 3px;
    }
  }

  &__hint {
    max-width: 290px;
    margin: 16px 0 0;
    text-align: center;
    letter-spacing: 1px;
    @include font(8px, 1.5, $mainFontName, $color-text-secondary, 400);
  }
}
</style>
