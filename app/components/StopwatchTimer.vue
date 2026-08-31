<script setup lang="ts">
interface LapItem {
  id: number
  number: number
  elapsedMilliseconds: number
}

const elapsedMilliseconds = ref(0)
const isRunning = ref(false)
const laps = ref<LapItem[]>([])
const lapsList = ref<HTMLElement | null>(null)

let animationFrameId: number | null = null
let startTimestamp = 0
let nextLapId = 1
let originalDocumentTitle = ''

const formattedTime = computed(() => {
  return handleFormatTime(elapsedMilliseconds.value)
})

const formattedTitleTime = computed(() => {
  const totalSeconds = Math.floor(elapsedMilliseconds.value / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return [hours, minutes, seconds]
    .map(value => String(value).padStart(2, '0'))
    .join(':')
})

function handleFormatTime(milliseconds: number) {
  const hours = Math.floor(milliseconds / 3_600_000)
  const minutes = Math.floor((milliseconds % 3_600_000) / 60_000)
  const seconds = Math.floor((milliseconds % 60_000) / 1000)
  const millisecondsPart = Math.floor(milliseconds % 1000)

  const mainTime = [hours, minutes, seconds]
    .map(value => String(value).padStart(2, '0'))
    .join(':')

  return `${mainTime}.${String(millisecondsPart).padStart(3, '0')}`
}

const handleStopAnimation = () => {
  if (animationFrameId === null) {
    return
  }

  cancelAnimationFrame(animationFrameId)
  animationFrameId = null
}

const handleTick = () => {
  elapsedMilliseconds.value = Date.now() - startTimestamp
  animationFrameId = requestAnimationFrame(handleTick)
}

const handleStart = () => {
  if (isRunning.value) {
    return
  }

  isRunning.value = true
  startTimestamp = Date.now() - elapsedMilliseconds.value
  animationFrameId = requestAnimationFrame(handleTick)
}

const handlePause = () => {
  if (!isRunning.value) {
    return
  }

  elapsedMilliseconds.value = Date.now() - startTimestamp
  isRunning.value = false
  handleStopAnimation()
}

const handleToggle = () => {
  if (isRunning.value) {
    handlePause()
    return
  }

  handleStart()
}

const handleReset = () => {
  handleStopAnimation()
  isRunning.value = false
  elapsedMilliseconds.value = 0
  laps.value = []
  nextLapId = 1
}

const handleLap = async () => {
  if (!isRunning.value) {
    return
  }

  const currentElapsedMilliseconds = Date.now() - startTimestamp

  laps.value.unshift({
    id: nextLapId,
    number: nextLapId,
    elapsedMilliseconds: currentElapsedMilliseconds
  })

  nextLapId += 1
  await nextTick()
  lapsList.value?.scrollTo({ top: 0, behavior: 'smooth' })
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

  if (event.key.toLowerCase() === 'l') {
    void handleLap()
  }

  if (event.key.toLowerCase() === 'r') {
    handleReset()
  }
}

const handleVisibilityChange = () => {
  if (document.visibilityState === 'visible' && isRunning.value) {
    elapsedMilliseconds.value = Date.now() - startTimestamp
  }
}

watch(formattedTitleTime, (time) => {
  if (import.meta.client) {
    document.title = `${time} - Stopwatch`
  }
})

onMounted(() => {
  originalDocumentTitle = document.title
  window.addEventListener('keydown', handleKeydown)
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onBeforeUnmount(() => {
  handleStopAnimation()
  document.title = originalDocumentTitle
  window.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<template>
  <main class="stopwatch-timer">
    <div class="stopwatch-timer__container">
      <header class="stopwatch-timer__header">
        <p class="stopwatch-timer__eyebrow">Elapsed time</p>
        <h1 class="stopwatch-timer__title">Stopwatch</h1>
      </header>

      <section
        class="stopwatch-timer__display"
        aria-label="Поточний час секундоміра"
      >
        <time class="stopwatch-timer__time">
          {{ formattedTime }}
        </time>
      </section>

      <div class="stopwatch-timer__controls">
        <button
          class="stopwatch-timer__secondary-button"
          type="button"
          :disabled="elapsedMilliseconds === 0 && laps.length === 0"
          @click="handleReset"
        >
          Reset
        </button>

        <button
          class="stopwatch-timer__primary-button"
          type="button"
          :aria-label="isRunning ? 'Призупинити секундомір' : 'Запустити секундомір'"
          @click="handleToggle"
        >
          {{ isRunning ? 'Pause' : 'Start' }}
        </button>

        <button
          class="stopwatch-timer__secondary-button"
          type="button"
          :disabled="!isRunning"
          @click="handleLap"
        >
          Lap
        </button>
      </div>

      <section
        v-if="laps.length"
        class="stopwatch-timer__laps"
        aria-label="Кола секундоміра"
      >
        <div class="stopwatch-timer__laps-header" aria-hidden="true">
          <span>Lap</span>
          <span>Time</span>
        </div>

        <ol
          ref="lapsList"
          class="stopwatch-timer__laps-list"
        >
          <li
            v-for="lap in laps"
            :key="lap.id"
            class="stopwatch-timer__lap"
          >
            <span class="stopwatch-timer__lap-number">
              {{ String(lap.number).padStart(2, '0') }}
            </span>
            <time class="stopwatch-timer__lap-time">
              {{ handleFormatTime(lap.elapsedMilliseconds) }}
            </time>
          </li>
        </ol>
      </section>

      <p class="stopwatch-timer__hint">
        <span class="stopwatch-timer__hint-accent">Phase 2</span>
        Smart laps will categorize coding, design, research and debugging.
      </p>
    </div>
  </main>
</template>

<style scoped lang="scss">
.stopwatch-timer {
  @include flexCenter;
  width: 100%;
  min-height: calc(100svh - 160px);
  padding: 76px 8px;
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
    @include flexCenter;
    width: 100%;
    min-height: 136px;
    margin-top: 26px;
    border-top: 1px solid $color-border;
    border-bottom: 1px solid $color-border;

    @include breakpoint($tablet) {
      min-height: 156px;
    }
  }

  &__time {
    display: block;
    white-space: nowrap;
    letter-spacing: -3px;
    font-variant-numeric: tabular-nums;
    @include font(32px, 1, $mainFontName, $color-text, 300);

    @include breakpoint($mobile) {
      @include font(56px, 1, $mainFontName, $color-text, 300);
    }

    @include breakpoint($tablet) {
      @include font(72px, 1, $mainFontName, $color-text, 300);
    }
  }

  &__controls {
    display: grid;
    grid-template-columns: 62px 126px 62px;
    align-items: center;
    gap: 10px;
    margin-top: 22px;
  }

  &__secondary-button {
    padding: 10px 4px;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 5px;
    cursor: pointer;
    @include font(12px, 1.2, $mainFontName, $color-text-secondary, 400);
    transition: color 0.2s ease, border-color 0.2s ease;

    &:hover:not(:disabled) {
      color: $color-text;
      border-color: $color-primary;
    }

    &:focus-visible {
      outline: 2px solid $color-primary;
      outline-offset: 2px;
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.35;
    }
  }

  &__primary-button {
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

  &__laps {
    width: calc(100% - 32px);
    max-width: 466px;
    margin-top: 26px;
    border-top: 1px solid $color-border;
  }

  &__laps-header {
    @include flex(space-between, center);
    padding: 12px 7px 10px;
    text-transform: uppercase;
    letter-spacing: 1px;
    @include font(8px, 1.2, $mainFontName, $color-text-secondary, 400);
  }

  &__laps-list {
    max-height: 250px;
    margin: 0;
    padding: 0;
    overflow-y: auto;
    list-style: none;
    scrollbar-color: $color-border $color-bg;
    scrollbar-width: thin;
  }

  &__lap {
    @include flex(space-between, center);
    min-height: 39px;
    padding: 8px 7px;
    border-top: 1px solid $color-border;
  }

  &__lap-number {
    font-variant-numeric: tabular-nums;
    @include font(12px, 1.2, $mainFontName, $color-text, 500);
  }

  &__lap-time {
    font-variant-numeric: tabular-nums;
    @include font(12px, 1.2, $mainFontName, $color-text, 700);
  }

  &__hint {
    margin: 24px 0 0;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 1px;
    @include font(8px, 1.5, $mainFontName, $color-text-secondary, 400);
  }

  &__hint-accent {
    margin-right: 8px;
    color: $color-primary;
    font-weight: 800;
  }
}
</style>
