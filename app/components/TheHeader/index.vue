<script setup lang="ts">
import SiteLogo from '~/common/SiteLogo.vue'

const emit = defineEmits<{
  openSettings: []
}>()
</script>

<template>
  <header class="the-header">
    <div class="the-header__container">
      <div class="the-header__main">
        <div class="the-header__logo">
          <SiteLogo />
        </div>

        <div class="the-header__desktop-navigation">
          <Navigation />
        </div>

        <div class="the-header__actions">
          <button
            class="the-header__settings-button"
            type="button"
            aria-label="Відкрити налаштування"
            aria-haspopup="dialog"
            title="Налаштування"
            @click="emit('openSettings')"
          >
            <svg
              class="the-header__settings-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M9.5 3H14.5L15 5.5L17 6.7L19.4 6L21.9 10.3L20 12L21.9 13.7L19.4 18L17 17.3L15 18.5L14.5 21H9.5L9 18.5L7 17.3L4.6 18L2.1 13.7L4 12L2.1 10.3L4.6 6L7 6.7L9 5.5L9.5 3Z"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />

              <circle
                cx="12"
                cy="12"
                r="3.2"
                stroke="currentColor"
                stroke-width="1.6"
              />
            </svg>
          </button>
        </div>
      </div>

      <div class="the-header__mobile-navigation">
        <Navigation />
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
  .the-header {
    position: relative;
    z-index: 10;
    flex-shrink: 0;
    width: 100%;
    color: $color-text;
    background: $color-footer;
    border-bottom: 1px solid $color-border;

    &,
    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    &__container {
      width: 100%;
      max-width: $desktopLarge;
      margin-inline: auto;
      padding: 12px 16px 0;

      @include breakpoint($tablet) {
        padding: 0 30px;
      }
    }

    &__main {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      gap: 16px;
      width: 100%;
      min-height: 44px;

      @include breakpoint($tablet) {
        grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
        min-height: 72px;
        gap: 24px;
      }
    }

    &__logo {
      display: flex;
      align-items: center;
      justify-self: start;
      min-width: 0;
      max-width: 100%;
    }

    &__desktop-navigation {
      display: none;

      @include breakpoint($tablet) {
        display: block;
        justify-self: center;
      }
    }

    &__mobile-navigation {
      margin-top: 12px;
      padding-bottom: 12px;

      @include breakpoint($tablet) {
        display: none;
      }
    }

    &__actions {
      display: flex;
      align-items: center;
      justify-self: end;
    }

    &__settings-button {
      @include flexCenter;

      width: 44px;
      height: 44px;
      padding: 0;
      color: $color-text;
      background: $color-surface;
      border: 1px solid $color-border;
      border-radius: 12px;
      cursor: pointer;
      transition:
        color 0.2s ease,
        background 0.2s ease,
        border-color 0.2s ease;

      @media (hover: hover) {
        &:hover {
          color: $color-primary;
          background: $color-pale;
          border-color: $color-primary;

          .the-header__settings-icon {
            transform: rotate(30deg);
          }
        }
      }

      &:active {
        background: $color-pale;
      }

      &:focus-visible {
        outline: 2px solid $color-primary;
        outline-offset: 4px;
      }

      @media (prefers-reduced-motion: reduce) {
        transition: none;
      }
    }

    &__settings-icon {
      display: block;
      flex-shrink: 0;
      transition: transform 0.25s ease;

      @media (prefers-reduced-motion: reduce) {
        transition: none;
      }
    }
  }
</style>