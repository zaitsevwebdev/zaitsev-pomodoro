<script setup lang="ts">
type TimerMode = 'focus' | 'shortBreak' | 'longBreak'

interface TimerOption {
  label: string
  duration: number
}

const timerOptions: Record<TimerMode, TimerOption> = {
  focus: { label: 'Focus', duration: 25 * 60 },
  shortBreak: { label: 'Short break', duration: 5 * 60 },
  longBreak: { label: 'Long break', duration: 15 * 60 }
}

const currentMode = ref<TimerMode>('focus')
const remainingSeconds = ref(timerOptions.focus.duration)
const isRunning = ref(false)
const focusSession = ref(1)
const timerElement = ref<HTMLElement | null>(null)

let intervalId: ReturnType<typeof setInterval> | null = null
let endTimestamp = 0
let originalDocumentTitle = ''

const activeTimer = computed(() => timerOptions[currentMode.value])

const formattedTime = computed(() => {
  const minutes = Math.floor(remainingSeconds.value / 60)
  const seconds = remainingSeconds.value % 60

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

const progress = computed(() => {
  const elapsedSeconds = activeTimer.value.duration - remainingSeconds.value

  return Math.min(100, Math.max(0, (elapsedSeconds / activeTimer.value.duration) * 100))
})

const timerTitle = computed(() => `${formattedTime.value} - ${activeTimer.value.label}`)

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

const handleSetMode = (mode: TimerMode) => {
  handlePause()
  currentMode.value = mode
  remainingSeconds.value = timerOptions[mode].duration
}

const handleComplete = () => {
  handlePause()

  if (currentMode.value === 'focus') {
    const completedSession = focusSession.value
    focusSession.value = completedSession === 4 ? 1 : completedSession + 1
    handleSetMode(completedSession === 4 ? 'longBreak' : 'shortBreak')
    return
  }

  handleSetMode('focus')
}

const handleTick = () => {
  const nextRemainingSeconds = Math.max(0, Math.ceil((endTimestamp - Date.now()) / 1000))
  remainingSeconds.value = nextRemainingSeconds

  if (nextRemainingSeconds === 0) {
    handleComplete()
  }
}

const handleStart = () => {
  if (isRunning.value || remainingSeconds.value === 0) {
    return
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
  remainingSeconds.value = activeTimer.value.duration
}

const handleSkip = () => {
  handleComplete()
}

const handleFocusMode = async () => {
  if (!import.meta.client || !timerElement.value) {
    return
  }

  if (document.fullscreenElement) {
    await document.exitFullscreen()
    return
  }

  await timerElement.value.requestFullscreen()
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

  if (event.key.toLowerCase() === 'f') {
    void handleFocusMode()
  }
}

const handleVisibilityChange = () => {
  if (document.visibilityState === 'visible' && isRunning.value) {
    handleTick()
  }
}

watch(timerTitle, (title) => {
  if (import.meta.client) {
    document.title = title
  }
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
  <main
    ref="timerElement"
    class="pomodoro-timer"
  >
    <div class="pomodoro-timer__container">
      <div
        class="pomodoro-timer__modes"
        role="group"
        aria-label="Режим таймера"
      >
        <button
          v-for="(option, mode) in timerOptions"
          :key="mode"
          class="pomodoro-timer__mode"
          :class="{ 'pomodoro-timer__mode--active': currentMode === mode }"
          type="button"
          :aria-pressed="currentMode === mode"
          @click="handleSetMode(mode)"
        >
          {{ option.label }}
        </button>
      </div>

      <section
        class="pomodoro-timer__panel"
        :aria-label="`${activeTimer.label}: ${formattedTime}`"
      >
        <span
          class="pomodoro-timer__progress"
          :style="{ width: `${progress}%` }"
        />

        <div class="pomodoro-timer__mark" aria-hidden="true">Λ</div>
        <p class="pomodoro-timer__status">{{ activeTimer.label }}</p>
        <time class="pomodoro-timer__time">{{ formattedTime }}</time>
        <p class="pomodoro-timer__session">Session {{ focusSession }} / 4</p>
      </section>

      <div class="pomodoro-timer__controls">
        <button
          class="pomodoro-timer__secondary-button"
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
          class="pomodoro-timer__primary-button"
          type="button"
          :aria-label="isRunning ? 'Призупинити таймер' : 'Запустити таймер'"
          @click="handleToggle"
        >
          {{ isRunning ? 'Pause' : 'Start' }}
        </button>

        <button
          class="pomodoro-timer__secondary-button"
          type="button"
          aria-label="Пропустити поточний режим"
          title="Skip"
          @click="handleSkip"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 5.5L14 12L5 18.5V5.5Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
            <path d="M18 5V19" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
          </svg>
        </button>
      </div>

      <button
        class="pomodoro-timer__focus-button"
        type="button"
        @click="handleFocusMode"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 4H4V9M15 4H20V9M9 20H4V15M15 20H20V15" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        Focus mode
      </button>

      <p class="pomodoro-timer__hint">SPACE to start · R to reset · F for focus mode</p>
    </div>
  </main>
</template>

<style scoped lang="scss">
.pomodoro-timer {
  @include flexCenter;
  width: 100%;
  min-height: calc(100svh - 160px);
  padding: 70px 14px;
  background: $color-bg;

  &__container {
    @include flexCenter;
    width: 100%;
    max-width: 510px;
    flex-direction: column;
  }

  &__modes {
    @include flex(center, center);
    max-width: 100%;
    gap: 3px;
    padding: 4px;
    background: $color-surface;
    border: 1px solid $color-border;
    border-radius: 10px;
  }

  &__mode {
    padding: 9px 10px;
    white-space: nowrap;
    text-transform: uppercase;
    letter-spacing: 1px;
    background: transparent;
    border: 0;
    border-radius: 7px;
    cursor: pointer;
    @include font(8px, 1.2, $mainFontName, $color-text-secondary, 700);
    transition: color 0.2s ease, background 0.2s ease;

    &:hover {
      color: $color-text;
    }

    &:focus-visible {
      outline: 2px solid $color-primary;
      outline-offset: 2px;
    }

    &--active {
      color: $color-text;
      background: $color-pale;
    }
  }

  &__panel {
    position: relative;
    @include flexCenter;
    width: 100%;
    min-height: 214px;
    flex-direction: column;
    margin-top: 28px;
    overflow: hidden;
    background: $color-surface;
    border: 1px solid $color-border;
    border-radius: 18px;
    box-shadow: 0 24px 60px $color-footer, inset 0 0 0 12px $color-bg-secondary;

    @include breakpoint($tablet) {
      min-height: 264px;
      margin-top: 34px;
    }
  }

  &__progress {
    position: absolute;
    top: 0;
    left: 0;
    height: 3px;
    background: $color-primary;
    box-shadow: 0 0 15px $color-primary;
    transition: width 0.25s linear;
  }

  &__mark {
    text-shadow: 0 0 12px $color-primary;
    @include font(15px, 1, $mainFontName, $color-primary, 800);
  }

  &__status {
    margin: 24px 0 0;
    text-transform: uppercase;
    letter-spacing: 3px;
    @include font(9px, 1.2, $mainFontName, $color-primary, 800);
  }

  &__time {
    display: block;
    margin-top: 8px;
    letter-spacing: -4px;
    font-variant-numeric: tabular-nums;
    @include font(64px, 1, $mainFontName, $color-text, 300);

    @include breakpoint($tablet) {
      @include font(92px, 1, $mainFontName, $color-text, 300);
    }
  }

  &__session {
    margin: 14px 0 0;
    @include font(11px, 1.3, $mainFontName, $color-text-secondary, 400);
  }

  &__controls {
    @include flex(center, center);
    gap: 12px;
    margin-top: 22px;
  }

  &__secondary-button {
    @include flexCenter;
    width: 38px;
    height: 38px;
    padding: 0;
    color: $color-text;
    background: $color-surface;
    border: 1px solid $color-border;
    border-radius: 9px;
    cursor: pointer;
    transition: color 0.2s ease, border-color 0.2s ease;

    &:hover {
      color: $color-primary;
      border-color: $color-primary-dark;
    }

    &:focus-visible {
      outline: 2px solid $color-primary;
      outline-offset: 2px;
    }
  }

  &__primary-button {
    min-width: 120px;
    padding: 13px 24px;
    background: $color-primary;
    border: 0;
    border-radius: 10px;
    box-shadow: 0 5px 28px $color-primary-dark;
    cursor: pointer;
    @include font(14px, 1.2, $mainFontName, $color-text-dark, 700);
    transition: background 0.2s ease, transform 0.2s ease;

    @include breakpoint($tablet) {
      min-width: 150px;
    }

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

  &__focus-button {
    @include flex(center, center);
    gap: 6px;
    margin-top: 20px;
    padding: 4px;
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

  &__hint {
    margin: 16px 0 0;
    text-align: center;
    letter-spacing: 1px;
    @include font(8px, 1.4, $mainFontName, $color-text-secondary, 400);
  }

  &:fullscreen {
    min-height: 100vh;
  }
}
</style>