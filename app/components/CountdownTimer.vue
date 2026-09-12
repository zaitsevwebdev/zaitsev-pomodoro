<script setup lang="ts">
const presets = [1, 5, 10, 15, 30, 60] as const

type TimerPreset = (typeof presets)[number]

const selectedPreset = ref<TimerPreset>(10)
const remainingSeconds = ref(selectedPreset.value * 60)
const isRunning = ref(false)
const isFinished = ref(false)

let intervalId: ReturnType<typeof setInterval> | null = null
let endTimestamp = 0
let remainingMilliseconds = selectedPreset.value * 60_000

const formattedTime = computed(() => {
  const hours = Math.floor(remainingSeconds.value / 3600)
  const minutes = Math.floor((remainingSeconds.value % 3600) / 60)
  const seconds = remainingSeconds.value % 60

  return [hours, minutes, seconds]
    .map(value => String(value).padStart(2, '0'))
    .join(':')
})

const buttonLabel = computed(() => {
  if (isRunning.value) return 'Pause'
  return isFinished.value ? 'Restart' : 'Start'
})

const buttonAriaLabel = computed(() => {
  if (isRunning.value) return 'Призупинити таймер'
  return isFinished.value ? 'Запустити таймер повторно' : 'Запустити таймер'
})

function handleStopInterval() {
  if (intervalId === null) return

  clearInterval(intervalId)
  intervalId = null
}

function handleComplete() {
  handleStopInterval()
  isRunning.value = false
  remainingMilliseconds = 0
  remainingSeconds.value = 0
  isFinished.value = true
}

function handleTick() {
  remainingMilliseconds = Math.max(0, endTimestamp - Date.now())
  remainingSeconds.value = Math.ceil(remainingMilliseconds / 1000)

  if (remainingMilliseconds === 0) {
    handleComplete()
  }
}

function handlePause() {
  if (!isRunning.value) return

  handleTick()
  handleStopInterval()
  isRunning.value = false
}

function handleStart() {
  if (isRunning.value) return

  if (isFinished.value || remainingMilliseconds === 0) {
    remainingMilliseconds = selectedPreset.value * 60_000
    remainingSeconds.value = selectedPreset.value * 60
    isFinished.value = false
  }

  endTimestamp = Date.now() + remainingMilliseconds
  isRunning.value = true
  intervalId = setInterval(handleTick, 250)
}

function handleToggle() {
  if (isRunning.value) {
    handlePause()
    return
  }

  handleStart()
}

function handleReset() {
  handleStopInterval()
  isRunning.value = false
  isFinished.value = false
  remainingMilliseconds = selectedPreset.value * 60_000
  remainingSeconds.value = selectedPreset.value * 60
}

function handleSelectPreset(preset: TimerPreset) {
  selectedPreset.value = preset
  handleReset()
}

function handleKeydown(event: KeyboardEvent) {
  if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) return

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
  }
}

function handleVisibilityChange() {
  if (!document.hidden && isRunning.value) {
    handleTick()
  }
}

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
  <div class="countdown-timer">
    <div class="countdown-timer__container">
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
          {{ preset }} хв
        </button>
      </div>

      <div class="countdown-timer__display">
        <p class="countdown-timer__status">
          <span class="countdown-timer__mark" aria-hidden="true">Λ</span>
          Countdown
        </p>

        <time
          class="countdown-timer__time"
          :class="{ 'countdown-timer__time--finished': isFinished }"
          :datetime="`PT${remainingSeconds}S`"
          aria-live="off"
        >
          {{ formattedTime }}
        </time>

        <p
          class="countdown-timer__announcement"
          role="status"
          aria-atomic="true"
        >
          {{ isFinished ? 'Час вийшов' : '' }}
        </p>
      </div>

      <div class="countdown-timer__controls">
        <button
          class="countdown-timer__reset"
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
          class="countdown-timer__toggle"
          type="button"
          :aria-label="buttonAriaLabel"
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

          {{ buttonLabel }}
        </button>
      </div>

      <p class="countdown-timer__shortcuts">
        <span><kbd>Space</kbd> start / pause</span>
        <span><kbd>R</kbd> reset</span>
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .countdown-timer {
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

    &__presets {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      width: 100%;
      max-width: 280px;
      gap: 6px;

      @include breakpoint($mobile) {
        grid-template-columns: repeat(6, minmax(0, 1fr));
        max-width: 440px;
      }
    }

    &__preset {
      min-width: 0;
      min-height: 44px;
      padding: 10px 6px;
      color: $color-text-secondary;
      background: $color-surface;
      border: 1px solid $color-border;
      border-radius: 10px;
      font: inherit;
      font-size: 12px;
      font-weight: 500;
      line-height: 1.5;
      white-space: nowrap;
      cursor: pointer;
      transition:
        color 0.2s ease,
        border-color 0.2s ease,
        background 0.2s ease;

      &:hover {
        color: $color-text;
        border-color: $color-text-secondary;
      }

      &--active,
      &--active:hover {
        color: $color-primary;
        background: $color-pale;
        border-color: $color-primary;
      }

      @media (prefers-reduced-motion: reduce) {
        transition: none;
      }
    }

    &__display {
      @include flexCenter;

      flex-direction: column;
      width: 100%;
      min-width: 0;
      margin-top: 32px;

      @include breakpoint($tablet) {
        margin-top: 40px;
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
      font-size: 48px;
      font-weight: 300;
      line-height: 1.2;
      letter-spacing: -0.045em;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;

      @include breakpoint($mobile) {
        font-size: 72px;
      }

      @include breakpoint($tabletSmall) {
        font-size: 88px;
      }

      @include breakpoint($tablet) {
        font-size: 104px;
      }

      @include breakpoint($tabletLandscape) {
        font-size: 120px;
      }

      &--finished {
        color: $color-primary;
      }
    }

    &__announcement {
      min-height: 21px;
      margin: 12px 0 0;
      color: $color-primary;
      font-size: 14px;
      font-weight: 500;
      line-height: 1.5;
      text-align: center;
    }

    &__controls {
      display: grid;
      grid-template-columns: 46px minmax(136px, auto) 46px;
      align-items: center;
      gap: 12px;
      margin-top: 20px;

      @include breakpoint($tablet) {
        grid-template-columns: 50px minmax(164px, auto) 50px;
        gap: 16px;
        margin-top: 24px;
      }
    }

    &__reset {
      @include flexCenter;

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

    &__toggle {
      @include flex(center, center);

      gap: 10px;
      min-height: 52px;
      padding: 14px 20px;
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

    &__shortcuts {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 8px 14px;
      margin: 24px 0 0;
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
  }
</style>