<script setup lang="ts">
type TimerMode = 'focus' | 'shortBreak' | 'longBreak'

const { settings } = useSettings()

const timerOptions = computed(() => ({
  focus: {
    label: 'Focus',
    duration: settings.value.focus * 60,
  },
  shortBreak: {
    label: 'Short break',
    duration: settings.value.shortBreak * 60,
  },
  longBreak: {
    label: 'Long break',
    duration: settings.value.longBreak * 60,
  },
}))

const currentMode = ref<TimerMode>('focus')
const intervalDuration = ref(timerOptions.value.focus.duration)
const remainingSeconds = ref(intervalDuration.value)
const isRunning = ref(false)
const hasStarted = ref(false)
const focusSession = ref(1)
const timerElement = ref<HTMLElement | null>(null)

let intervalId: ReturnType<typeof setInterval> | null = null
let endTimestamp = 0
let remainingMilliseconds = intervalDuration.value * 1000

const activeTimer = computed(() => ({
  label: timerOptions.value[currentMode.value].label,
  duration: intervalDuration.value,
}))

const formattedTime = computed(() => {
  const minutes = Math.floor(remainingSeconds.value / 60)
  const seconds = remainingSeconds.value % 60

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

const progress = computed(() =>
  Math.min(
    100,
    Math.max(
      0,
      ((intervalDuration.value - remainingSeconds.value) / intervalDuration.value) * 100,
    ),
  ),
)

function handleStopInterval() {
  if (intervalId === null) return

  clearInterval(intervalId)
  intervalId = null
}

function handleSetMode(mode: TimerMode) {
  handleStopInterval()
  isRunning.value = false
  hasStarted.value = false
  currentMode.value = mode
  intervalDuration.value = timerOptions.value[mode].duration
  remainingSeconds.value = intervalDuration.value
  remainingMilliseconds = intervalDuration.value * 1000
}

function handleComplete(allowAutoStart = true) {
  const completedMode = currentMode.value

  if (completedMode === 'focus') {
    const completedSession = focusSession.value
    focusSession.value = completedSession === 4 ? 1 : completedSession + 1

    handleSetMode(completedSession === 4 ? 'longBreak' : 'shortBreak')
  } else {
    handleSetMode('focus')
  }

  const shouldAutoStart = currentMode.value === 'focus'
    ? settings.value.autoStartFocus
    : settings.value.autoStartBreaks

  if (allowAutoStart && shouldAutoStart) {
    handleStart()
  }
}

function handleTick() {
  remainingMilliseconds = Math.max(0, endTimestamp - Date.now())
  remainingSeconds.value = Math.ceil(remainingMilliseconds / 1000)

  if (remainingMilliseconds === 0) {
    handleComplete()
  }
}

function handleStart() {
  if (isRunning.value || remainingMilliseconds <= 0) return

  hasStarted.value = true
  isRunning.value = true
  endTimestamp = Date.now() + remainingMilliseconds
  intervalId = setInterval(handleTick, 250)
}

function handlePause() {
  if (!isRunning.value) return

  remainingMilliseconds = Math.max(0, endTimestamp - Date.now())
  remainingSeconds.value = Math.ceil(remainingMilliseconds / 1000)
  handleStopInterval()
  isRunning.value = false

  if (remainingMilliseconds === 0) {
    handleComplete(false)
  }
}

function handleToggle() {
  if (isRunning.value) {
    handlePause()
    return
  }

  handleStart()
}

function handleReset() {
  handleSetMode(currentMode.value)
}

function handleSkip() {
  handleComplete(false)
}

async function handleFocusMode() {
  if (!timerElement.value) return

  try {
    if (document.fullscreenElement === timerElement.value) {
      await document.exitFullscreen()
      return
    }

    if (document.fullscreenEnabled) {
      await timerElement.value.requestFullscreen()
    }
  } catch {
    return
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) return

  // Горячие клавиши таймера не работают внутри открытых диалогов.
  if (document.querySelector('dialog[open]')) return

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

  if (event.code === 'Space') {
    event.preventDefault()
    handleToggle()
    return
  }

  if (event.key.toLowerCase() === 'r') {
    handleReset()
    return
  }

  if (event.key.toLowerCase() === 'f') {
    void handleFocusMode()
  }
}

function handleVisibilityChange() {
  if (!document.hidden && isRunning.value) {
    handleTick()
  }
}

watch(
  () => timerOptions.value[currentMode.value].duration,
  () => {
    if (!hasStarted.value) {
      handleReset()
    }
  },
)

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onBeforeUnmount(() => {
  handleStopInterval()
  window.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<template>
  <div ref="timerElement" class="pomodoro-timer">
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

      <div class="pomodoro-timer__display">
        <p class="pomodoro-timer__status">
          <span class="pomodoro-timer__mark" aria-hidden="true">Λ</span>
          {{ activeTimer.label }}
        </p>

        <time
          class="pomodoro-timer__time"
          :datetime="`PT${remainingSeconds}S`"
          aria-live="off"
        >
          {{ formattedTime }}
        </time>

        <div
          class="pomodoro-timer__progress"
          role="progressbar"
          :aria-label="`Прогрес інтервалу ${activeTimer.label}`"
          :aria-valuenow="Math.round(progress)"
          :aria-valuemin="0"
          :aria-valuemax="100"
        >
          <span
            class="pomodoro-timer__progress-fill"
            :style="{ transform: `scaleX(${progress / 100})` }"
          />
        </div>

        <p class="pomodoro-timer__session">
          Session
          <span class="pomodoro-timer__session-current">
            {{ focusSession }}
          </span>
          <span>/ 4</span>
        </p>
      </div>

      <div class="pomodoro-timer__controls">
        <button
          class="pomodoro-timer__secondary-button"
          type="button"
          aria-label="Скинути таймер"
          title="Reset (R)"
          @click="handleReset"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4 4V9H9M5.3 15A8 8 0 1 0 6 7.1L4 9"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <button
          class="pomodoro-timer__primary-button"
          type="button"
          :aria-label="isRunning ? 'Призупинити таймер' : 'Запустити таймер'"
          @click="handleToggle"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              v-if="isRunning"
              d="M8 5V19M16 5V19"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
            />
            <path
              v-else
              d="M8 5L19 12L8 19V5Z"
              fill="currentColor"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linejoin="round"
            />
          </svg>

          {{ isRunning ? 'Pause' : 'Start' }}
        </button>

        <button
          class="pomodoro-timer__secondary-button"
          type="button"
          aria-label="Пропустити поточний режим"
          title="Skip"
          @click="handleSkip"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M5 5.5L14 12L5 18.5V5.5ZM18 5V19"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>

      <button
        class="pomodoro-timer__focus-button"
        type="button"
        title="Повноекранний режим (F)"
        @click="handleFocusMode"
      >
        <svg
          width="15"
          height="15"
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

        Focus mode
      </button>

      <p class="pomodoro-timer__hint">
        <span><kbd>Space</kbd> start / pause</span>
        <span><kbd>R</kbd> reset</span>
        <span><kbd>F</kbd> focus</span>
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .pomodoro-timer {
    @include flexCenter;

    width: 100%;
    min-width: 0;
    padding: 32px 14px;
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
      max-width: 600px;
      min-width: 0;
    }

    &__modes {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      width: 100%;
      max-width: 360px;
      gap: 4px;
      padding: 5px;
      background: $color-surface;
      border: 1px solid $color-border;
      border-radius: 14px;
    }

    &__mode {
      min-width: 0;
      min-height: 44px;
      padding: 10px 6px;
      color: $color-text-secondary;
      background: transparent;
      border: 0;
      border-radius: 9px;
      font: inherit;
      font-size: 11px;
      font-weight: 500;
      line-height: 1.4;
      cursor: pointer;
      transition:
        color 0.2s ease,
        background 0.2s ease;

      @include breakpoint($mobile) {
        padding-inline: 12px;
        font-size: 12px;
      }

      &:hover {
        color: $color-text;
      }

      &--active {
        color: $color-text;
        background: $color-pale;
        box-shadow: inset 0 0 0 1px $color-border;
      }

      @media (prefers-reduced-motion: reduce) {
        transition: none;
      }
    }

    &__display {
      @include flexCenter;

      flex-direction: column;
      width: 100%;
      margin-top: 36px;

      @include breakpoint($tablet) {
        margin-top: 44px;
      }
    }

    &__status {
      @include flex(center, center);

      gap: 10px;
      margin: 0;
      color: $color-primary;
      font-size: 10px;
      font-weight: 600;
      line-height: 1.5;
      letter-spacing: 0.16em;
      text-transform: uppercase;

      @include breakpoint($tablet) {
        font-size: 11px;
      }
    }

    &__mark {
      font-size: 17px;
      font-weight: 700;
      line-height: 1;
      letter-spacing: 0;
    }

    &__time {
      display: block;
      margin-top: 16px;
      font-size: 80px;
      font-weight: 300;
      line-height: 1.1;
      letter-spacing: -0.055em;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;

      @include breakpoint($mobile) {
        font-size: 108px;
      }

      @include breakpoint($tablet) {
        font-size: 144px;
      }

      @include breakpoint($tabletLandscape) {
        font-size: 160px;
      }
    }

    &__progress {
      width: 64%;
      max-width: 260px;
      height: 4px;
      margin-top: 24px;
      overflow: hidden;
      background: $color-border;
      border-radius: 999px;

      @include breakpoint($tablet) {
        margin-top: 28px;
      }
    }

    &__progress-fill {
      display: block;
      width: 100%;
      height: 100%;
      background: $color-primary;
      border-radius: inherit;
      transform-origin: center;
    }

    &__session {
      @include flex(center, center);

      gap: 6px;
      margin: 16px 0 0;
      color: $color-text-secondary;
      font-size: 12px;
      line-height: 1.5;
      font-variant-numeric: tabular-nums;
    }

    &__session-current {
      color: $color-text;
      font-weight: 600;
    }

    &__controls {
      @include flex(center, center);

      gap: 12px;
      margin-top: 28px;

      @include breakpoint($tablet) {
        gap: 16px;
        margin-top: 32px;
      }
    }

    &__secondary-button {
      @include flexCenter;

      flex-shrink: 0;
      width: 46px;
      height: 46px;
      padding: 0;
      color: $color-text-secondary;
      background: $color-surface;
      border: 1px solid $color-border;
      border-radius: 14px;
      cursor: pointer;
      transition:
        color 0.2s ease,
        border-color 0.2s ease;

      @include breakpoint($tablet) {
        width: 50px;
        height: 50px;
      }

      &:hover {
        color: $color-primary;
        border-color: $color-primary;
      }

      @media (prefers-reduced-motion: reduce) {
        transition: none;
      }
    }

    &__primary-button {
      @include flex(center, center);

      gap: 10px;
      min-width: 136px;
      min-height: 52px;
      padding: 14px 24px;
      color: $color-text-dark;
      background: $color-primary;
      border: 0;
      border-radius: 16px;
      font: inherit;
      font-size: 16px;
      font-weight: 600;
      line-height: 1.4;
      cursor: pointer;
      transition:
        background 0.2s ease,
        transform 0.2s ease;

      @include breakpoint($tablet) {
        min-width: 164px;
        min-height: 56px;
      }

      @media (hover: hover) {
        &:hover {
          background: $color-primary-dark;
          transform: translateY(-2px);
        }
      }

      &:active {
        transform: translateY(0);
      }

      @media (prefers-reduced-motion: reduce) {
        transition: none;

        &:hover {
          transform: none;
        }
      }
    }

    &__focus-button {
      @include flex(center, center);

      gap: 8px;
      min-height: 44px;
      margin-top: 16px;
      padding: 10px 14px;
      color: $color-text-secondary;
      background: transparent;
      border: 0;
      border-radius: 10px;
      font: inherit;
      font-size: 12px;
      line-height: 1.5;
      cursor: pointer;

      &:hover {
        color: $color-text;
      }
    }

    &__hint {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 8px 14px;
      margin: 12px 0 0;
      color: $color-text-secondary;
      font-size: 10px;
      line-height: 1.6;

      span {
        display: inline-flex;
        align-items: center;
        gap: 5px;
      }

      kbd {
        padding: 2px 5px;
        color: $color-text;
        background: $color-surface;
        border: 1px solid $color-border;
        border-radius: 4px;
        font: inherit;
      }
    }

    button:focus-visible {
      outline: 2px solid $color-primary;
      outline-offset: 4px;
    }

    &:fullscreen {
      width: 100%;
      height: 100%;
      min-height: 100svh;
      padding: 24px 14px;
      overflow: auto;
    }
  }
</style>