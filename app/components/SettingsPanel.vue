<script setup lang="ts">
const { theme, isDarkTheme, handleSetTheme } = useTheme()
const {
  settings,
  accentOptions,
  setAccent,
  setDuration,
  toggleAutoStart,
} = useSettings()

const dialogElement = ref<HTMLDialogElement | null>(null)
let returnFocusElement: HTMLElement | null = null

const durationOptions = [
  { key: 'focus', label: 'Focus' },
  { key: 'shortBreak', label: 'Short break' },
  { key: 'longBreak', label: 'Long break' },
] as const

const autoStartOptions = [
  { key: 'autoStartBreaks', label: 'Автозапуск перерв' },
  { key: 'autoStartFocus', label: 'Автозапуск Focus' },
] as const

function open() {
  if (!dialogElement.value || dialogElement.value.open) return

  returnFocusElement = document.activeElement instanceof HTMLElement
    ? document.activeElement
    : null

  dialogElement.value.showModal()
}

function close() {
  dialogElement.value?.close()
}

function handleClose() {
  returnFocusElement?.focus({ preventScroll: true })
}

function handleBackdropClick(event: MouseEvent) {
  if (event.target !== dialogElement.value) return

  const rect = dialogElement.value.getBoundingClientRect()

  if (
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom
  ) {
    close()
  }
}

function handleDurationChange(
  key: 'focus' | 'shortBreak' | 'longBreak',
  event: Event,
) {
  const input = event.target as HTMLInputElement

  if (input.value.trim()) {
    setDuration(key, Number(input.value))
  }

  input.value = String(settings.value[key])
}

defineExpose({ open })
</script>

<template>
  <dialog
    ref="dialogElement"
    class="settings-panel"
    aria-labelledby="settings-title"
    @click="handleBackdropClick"
    @close="handleClose"
  >
    <header class="settings-panel__header">
      <h2 id="settings-title">Налаштування</h2>

      <button
        class="settings-panel__close"
        type="button"
        aria-label="Закрити налаштування"
        autofocus
        @click="close"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M6 6L18 18M18 6L6 18"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </header>

    <section class="settings-panel__section" aria-labelledby="settings-appearance">
      <h3 id="settings-appearance" class="settings-panel__heading">
        Оформлення
      </h3>

      <div class="settings-panel__row">
        <span id="settings-theme-label">Тема</span>

        <div
          class="settings-panel__segments"
          role="group"
          aria-labelledby="settings-theme-label"
        >
          <button
            type="button"
            :aria-pressed="theme === 'dark'"
            @click="handleSetTheme('dark')"
          >
            Темна
          </button>

          <button
            type="button"
            :aria-pressed="theme === 'light'"
            @click="handleSetTheme('light')"
          >
            Світла
          </button>
        </div>
      </div>

      <div class="settings-panel__row settings-panel__row--accent">
        <span id="settings-accent-label">Акцент</span>

        <div
          class="settings-panel__accents"
          role="group"
          aria-labelledby="settings-accent-label"
        >
          <button
            v-for="accent in accentOptions"
            :key="accent.id"
            class="settings-panel__swatch"
            type="button"
            :aria-label="accent.name"
            :aria-pressed="settings.accent === accent.id"
            :title="accent.name"
            :style="{
              '--swatch-color': isDarkTheme ? accent.dark : accent.light,
              '--swatch-text': isDarkTheme ? '#141614' : '#ffffff',
            }"
            @click="setAccent(accent.id)"
          >
            <span
              class="settings-panel__swatch-color"
              aria-hidden="true"
            >
              <svg
                v-if="settings.accent === accent.id"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M5 12L10 17L19 7"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>

      <div class="settings-panel__row settings-panel__row--soon">
        <span>Background</span>
        <span class="settings-panel__badge">SOON</span>
      </div>

      <div class="settings-panel__row settings-panel__row--soon">
        <span>Ambient effect</span>
        <span class="settings-panel__badge">SOON</span>
      </div>
    </section>

    <section class="settings-panel__section" aria-labelledby="settings-pomodoro">
      <h3 id="settings-pomodoro" class="settings-panel__heading">
        Pomodoro
      </h3>

      <div
        v-for="option in durationOptions"
        :key="option.key"
        class="settings-panel__row"
      >
        <label :for="`duration-${option.key}`">
          {{ option.label }}
        </label>

        <div class="settings-panel__stepper">
          <button
            type="button"
            :aria-label="`Зменшити ${option.label} на хвилину`"
            :disabled="settings[option.key] <= 1"
            @click="setDuration(option.key, settings[option.key] - 1)"
          >
            −
          </button>

          <input
            :id="`duration-${option.key}`"
            type="number"
            min="1"
            max="180"
            step="1"
            :value="settings[option.key]"
            aria-describedby="settings-duration-hint"
            @change="handleDurationChange(option.key, $event)"
          >

          <span aria-hidden="true">хв</span>

          <button
            type="button"
            :aria-label="`Збільшити ${option.label} на хвилину`"
            :disabled="settings[option.key] >= 180"
            @click="setDuration(option.key, settings[option.key] + 1)"
          >
            +
          </button>
        </div>
      </div>

      <p id="settings-duration-hint" class="settings-panel__note">
        Від 1 до 180 хвилин. Зміни тривалості під час роботи
        або паузи застосуються до наступного інтервалу чи після Reset.
      </p>

      <div
        v-for="option in autoStartOptions"
        :key="option.key"
        class="settings-panel__row"
      >
        <span :id="`label-${option.key}`">{{ option.label }}</span>

        <button
          class="settings-panel__switch"
          type="button"
          role="switch"
          :aria-checked="settings[option.key]"
          :aria-labelledby="`label-${option.key}`"
          @click="toggleAutoStart(option.key)"
        >
          <span />
        </button>
      </div>

      <div class="settings-panel__row settings-panel__row--soon">
        <span>Alarm</span>
        <span class="settings-panel__badge">SOON</span>
      </div>
    </section>

    <p class="settings-panel__saved">
      Налаштування зберігаються автоматично.
    </p>
  </dialog>
</template>

<style scoped lang="scss">
  .settings-panel {
    position: fixed;
    inset: auto 0 0;
    width: 100%;
    max-width: none;
    max-height: 90dvh;
    margin: 0;
    padding: 20px 20px max(24px, env(safe-area-inset-bottom));
    overflow-y: auto;
    overscroll-behavior: contain;
    color: $color-text;
    background: $color-surface;
    border: 1px solid $color-border;
    border-radius: 24px 24px 0 0;
    font-family: $mainFontName;
    scrollbar-width: thin;
    scrollbar-color: $color-border $color-surface;

    @include breakpoint($tablet) {
      inset: 84px 24px auto auto;
      width: 390px;
      max-height: calc(100dvh - 108px);
      padding: 24px;
      border-radius: 24px;
    }

    &,
    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    &::backdrop {
      background: rgb(0 0 0 / 45%);
    }

    &__header {
      @include flex(space-between, center);

      gap: 16px;

      h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        line-height: 1.3;
        letter-spacing: -0.025em;
      }
    }

    &__close {
      @include flexCenter;

      width: 40px;
      height: 40px;
      padding: 0;
      color: $color-text;
      background: $color-pale;
      border: 1px solid $color-border;
      border-radius: 10px;
      cursor: pointer;
    }

    &__section {
      margin-top: 24px;

      & + & {
        padding-top: 24px;
        border-top: 1px solid $color-border;
      }
    }

    &__heading {
      margin: 0 0 12px;
      color: $color-text-secondary;
      font-size: 10px;
      font-weight: 600;
      line-height: 1.5;
      letter-spacing: 0.15em;
      text-transform: uppercase;
    }

    &__row {
      @include flex(space-between, center);

      gap: 12px;
      min-height: 56px;
      font-size: 13px;
      line-height: 1.5;

      &--accent {
        flex-wrap: wrap;
      }

      &--soon {
        color: $color-text-secondary;
      }
    }

    &__segments {
      display: flex;
      gap: 4px;
      padding: 4px;
      background: $color-bg;
      border: 1px solid $color-border;
      border-radius: 11px;

      button {
        min-height: 36px;
        padding: 7px 11px;
        color: $color-text-secondary;
        background: transparent;
        border: 0;
        border-radius: 7px;
        font: inherit;
        font-size: 12px;
        cursor: pointer;

        &[aria-pressed='true'] {
          color: $color-text;
          background: $color-pale;
        }
      }
    }

    &__accents {
      display: flex;
      flex-wrap: wrap;
      gap: 2px;
    }

    &__swatch {
      @include flexCenter;

      width: 34px;
      height: 40px;
      padding: 0;
      background: transparent;
      border: 0;
      border-radius: 8px;
      cursor: pointer;

      &[aria-pressed='true'] .settings-panel__swatch-color {
        outline: 1px solid $color-text;
        outline-offset: 3px;
      }
    }

    &__swatch-color {
      @include flexCenter;

      width: 24px;
      height: 24px;
      color: var(--swatch-text);
      background: var(--swatch-color);
      border-radius: 50%;
    }

    &__badge {
      padding: 3px 7px;
      border: 1px solid $color-border;
      border-radius: 6px;
      font-size: 9px;
      line-height: 1.5;
      letter-spacing: 0.1em;
    }

    &__stepper {
      @include flex(center, center);

      gap: 4px;
      padding: 4px;
      background: $color-bg;
      border: 1px solid $color-border;
      border-radius: 11px;

      button {
        width: 32px;
        height: 34px;
        padding: 0;
        color: $color-text;
        background: $color-pale;
        border: 0;
        border-radius: 7px;
        font: inherit;
        font-size: 18px;
        cursor: pointer;

        &:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
      }

      input {
        width: 34px;
        padding: 4px 0;
        color: $color-text;
        background: transparent;
        border: 0;
        border-radius: 4px;
        appearance: textfield;
        font: inherit;
        text-align: center;
        font-variant-numeric: tabular-nums;

        &::-webkit-inner-spin-button,
        &::-webkit-outer-spin-button {
          margin: 0;
          -webkit-appearance: none;
        }
      }

      > span {
        margin-right: 3px;
        color: $color-text-secondary;
        font-size: 11px;
      }
    }

    &__note,
    &__saved {
      margin: 12px 0;
      color: $color-text-secondary;
      font-size: 11px;
      line-height: 1.7;
    }

    &__switch {
      position: relative;
      flex-shrink: 0;
      width: 48px;
      height: 28px;
      padding: 3px;
      background: $color-border;
      border: 0;
      border-radius: 999px;
      cursor: pointer;

      span {
        display: block;
        width: 22px;
        height: 22px;
        background: $color-text;
        border-radius: 50%;
        transition: transform 0.2s ease;
      }

      &[aria-checked='true'] {
        background: $color-primary;

        span {
          background: $color-text-dark;
          transform: translateX(20px);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        span {
          transition: none;
        }
      }
    }

    &__saved {
      margin: 24px 0 0;
      text-align: center;
    }

    button:focus-visible,
    input:focus-visible {
      outline: 2px solid $color-primary;
      outline-offset: 3px;
    }
  }
</style>