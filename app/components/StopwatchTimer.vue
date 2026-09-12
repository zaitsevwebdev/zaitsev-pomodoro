<script setup lang="ts">
interface LapItem {
  id: number
  elapsedMilliseconds: number
}

const elapsedMilliseconds = ref(0)
const isRunning = ref(false)
const laps = ref<LapItem[]>([])
const lapsList = ref<HTMLElement | null>(null)

let animationFrameId: number | null = null
let startTimestamp = 0
let nextLapId = 1

function formatTime(milliseconds: number) {
  const hours = Math.floor(milliseconds / 3_600_000)
  const minutes = Math.floor((milliseconds % 3_600_000) / 60_000)
  const seconds = Math.floor((milliseconds % 60_000) / 1000)

  const main = [hours, minutes, seconds]
    .map(value => String(value).padStart(2, '0'))
    .join(':')

  const fraction = String(Math.floor(milliseconds % 1000)).padStart(3, '0')

  return { main, fraction }
}

const formattedTime = computed(() => formatTime(elapsedMilliseconds.value))

function formatLap(milliseconds: number) {
  const { main, fraction } = formatTime(milliseconds)
  return `${main}.${fraction}`
}

function readElapsedTime() {
  return Math.max(0, Date.now() - startTimestamp)
}

function handleStopAnimation() {
  if (animationFrameId === null) return

  cancelAnimationFrame(animationFrameId)
  animationFrameId = null
}

function handleTick() {
  animationFrameId = null

  if (!isRunning.value) return

  elapsedMilliseconds.value = readElapsedTime()
  animationFrameId = requestAnimationFrame(handleTick)
}

function handleStart() {
  if (isRunning.value) return

  startTimestamp = Date.now() - elapsedMilliseconds.value
  isRunning.value = true
  handleTick()
}

function handlePause() {
  if (!isRunning.value) return

  elapsedMilliseconds.value = readElapsedTime()
  isRunning.value = false
  handleStopAnimation()
}

function handleToggle() {
  if (isRunning.value) {
    handlePause()
    return
  }

  handleStart()
}

function handleReset() {
  handleStopAnimation()
  isRunning.value = false
  elapsedMilliseconds.value = 0
  laps.value = []
  nextLapId = 1
}

async function handleLap() {
  if (!isRunning.value) return

  const elapsed = readElapsedTime()
  elapsedMilliseconds.value = elapsed

  laps.value.unshift({
    id: nextLapId++,
    elapsedMilliseconds: elapsed,
  })

  await nextTick()

  if (lapsList.value) {
    lapsList.value.scrollTop = 0
  }
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

  if (event.key.toLowerCase() === 'l') {
    void handleLap()
    return
  }

  if (event.key.toLowerCase() === 'r') {
    handleReset()
  }
}

function handleVisibilityChange() {
  handleStopAnimation()

  if (!document.hidden && isRunning.value) {
    handleTick()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onBeforeUnmount(() => {
  handleStopAnimation()
  window.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<template>
  <div class="stopwatch-timer">
    <div class="stopwatch-timer__container">
      <p class="stopwatch-timer__status">
        <span class="stopwatch-timer__mark" aria-hidden="true">Λ</span>
        Elapsed time
      </p>

      <div class="stopwatch-timer__display">
        <time
          class="stopwatch-timer__time"
          :datetime="`PT${(elapsedMilliseconds / 1000).toFixed(3)}S`"
          aria-live="off"
        >
          <span>{{ formattedTime.main }}</span>
          <span class="stopwatch-timer__fraction">.{{ formattedTime.fraction }}</span>
        </time>
      </div>

      <div class="stopwatch-timer__controls">
        <button
          class="stopwatch-timer__secondary-button"
          type="button"
          aria-label="Скинути секундомір і видалити кола"
          title="Reset (R)"
          :disabled="!isRunning && elapsedMilliseconds === 0 && !laps.length"
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
          class="stopwatch-timer__secondary-button"
          type="button"
          aria-label="Зафіксувати коло"
          title="Lap (L)"
          :disabled="!isRunning"
          @click="handleLap"
        >
          Lap
        </button>
      </div>

      <p class="stopwatch-timer__shortcuts">
        <span><kbd>Space</kbd> start / pause</span>
        <span><kbd>L</kbd> lap</span>
        <span><kbd>R</kbd> reset</span>
      </p>

      <section
        v-if="laps.length"
        class="stopwatch-timer__laps"
        aria-labelledby="stopwatch-laps-title"
      >
        <header class="stopwatch-timer__laps-header">
          <h2 id="stopwatch-laps-title">Кола</h2>
          <span>Час від початку</span>
        </header>

        <ol
          ref="lapsList"
          class="stopwatch-timer__laps-list"
          tabindex="0"
          aria-label="Збережені кола, найновіші спочатку"
        >
          <li
            v-for="lap in laps"
            :key="lap.id"
            class="stopwatch-timer__lap"
          >
            <span class="stopwatch-timer__lap-number">
              {{ String(lap.id).padStart(2, '0') }}
            </span>

            <time :datetime="`PT${(lap.elapsedMilliseconds / 1000).toFixed(3)}S`">
              {{ formatLap(lap.elapsedMilliseconds) }}
            </time>
          </li>
        </ol>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .stopwatch-timer {
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
      max-width: 800px;
      min-width: 0;
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

    &__display {
      width: 100%;
      margin-top: 20px;
      text-align: center;
      scrollbar-width: thin;
      scrollbar-color: $color-border $color-bg;

      @include breakpoint($tablet) {
        margin-top: 24px;
      }
    }

    &__time {
      display: inline-flex;
      align-items: baseline;
      white-space: nowrap;
      font-size: 40px;
      font-weight: 300;
      line-height: 1.2;
      letter-spacing: -0.045em;
      font-variant-numeric: tabular-nums;

      @include breakpoint($mobile) {
        font-size: 60px;
      }

      @include breakpoint($tabletSmall) {
        font-size: 80px;
      }

      @include breakpoint($tablet) {
        font-size: 96px;
      }

      @include breakpoint($tabletLandscape) {
        font-size: 112px;
      }
    }

    &__fraction {
      color: $color-text-secondary;
      font-size: 0.45em;
      letter-spacing: -0.02em;
    }

    &__controls {
      display: grid;
      grid-template-columns: 60px 132px 60px;
      align-items: center;
      gap: 10px;
      margin-top: 32px;

      @include breakpoint($mobile) {
        grid-template-columns: 68px 156px 68px;
        gap: 14px;
      }

      @include breakpoint($tablet) {
        margin-top: 36px;
      }
    }

    &__secondary-button {
      min-height: 46px;
      padding: 10px 6px;
      color: $color-text;
      background: $color-surface;
      border: 1px solid $color-border;
      border-radius: 14px;
      font: inherit;
      font-size: 12px;
      line-height: 1.5;
      cursor: pointer;
      transition:
        color 0.2s ease,
        border-color 0.2s ease;

      &:hover:not(:disabled) {
        color: $color-primary;
        border-color: $color-primary;
      }

      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      @media (prefers-reduced-motion: reduce) {
        transition: none;
      }
    }

    &__primary-button {
      @include flex(center, center);

      gap: 10px;
      min-height: 52px;
      padding: 14px 18px;
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

    &__laps {
      width: 100%;
      max-width: 500px;
      margin-top: 32px;
      padding: 8px 14px;
      background: $color-surface;
      border: 1px solid $color-border;
      border-radius: 18px;

      @include breakpoint($tablet) {
        padding-inline: 20px;
      }
    }

    &__laps-header {
      @include flex(space-between, center);

      gap: 12px;
      padding: 12px 4px;
      color: $color-text-secondary;
      font-size: 11px;
      line-height: 1.5;

      h2 {
        margin: 0;
        color: $color-text;
        font: inherit;
        font-weight: 600;
      }
    }

    &__laps-list {
      max-height: 250px;
      margin: 0;
      padding: 0;
      overflow-y: auto;
      list-style: none;
      scrollbar-width: thin;
      scrollbar-color: $color-border $color-surface;
    }

    &__lap {
      @include flex(space-between, center);

      gap: 12px;
      min-height: 46px;
      padding: 10px 4px;
      border-top: 1px solid $color-border;
      font-size: 13px;
      line-height: 1.5;
      font-variant-numeric: tabular-nums;

      time {
        text-align: right;
        overflow-wrap: anywhere;
      }
    }

    &__lap-number {
      flex-shrink: 0;
      color: $color-primary;
      font-weight: 600;
    }

    button:focus-visible,
    &__laps-list:focus-visible {
      outline: 2px solid $color-primary;
      outline-offset: 4px;
    }
  }
</style>