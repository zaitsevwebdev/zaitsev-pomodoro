<script setup lang="ts">
import SiteLogo from '~/common/SiteLogo.vue';

interface Props {
  isDarkTheme?: boolean
}

withDefaults(defineProps<Props>(), {
  isDarkTheme: true
})

const emit = defineEmits<{
  toggleTheme: []
}>()

const handleThemeToggle = () => {
  emit('toggleTheme')
}
</script>

<template>
  <header class="the-header">
    <div class="the-header__container">
      <div class="the-header__main">
        <SiteLogo />

        <div class="the-header__desktop-navigation">
          <Navigation />
        </div>

        <button
          class="the-header__theme-button"
          type="button"
          :aria-label="
            isDarkTheme
              ? 'Увімкнути світлу тему'
              : 'Увімкнути темну тему'
          "
          @click="handleThemeToggle"
        >
          <svg
            v-if="isDarkTheme"
            class="the-header__theme-icon"
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M20.4 15.1A8.5 8.5 0 0 1 8.9 3.6 8.5 8.5 0 1 0 20.4 15.1Z"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>

          <svg
            v-else
            class="the-header__theme-icon"
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="12"
              r="4"
              stroke="currentColor"
              stroke-width="1.8"
            />
            <path
              d="M12 2V4M12 20V22M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M2 12H4M20 12H22M4.93 19.07L6.34 17.66M17.66 6.34L19.07 4.93"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
          </svg>
        </button>
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
  width: 100%;
  background: $color-footer;
  border-bottom: 1px solid $color-text-dark;

  &__container {
    width: 100%;
    max-width: $desktopLarge;
    margin: 0 auto;
    padding: 10px 14px 0;

    @include breakpoint($tablet) {
      padding: 0 30px;
    }
  }

  &__main {
    @include flex(space-between, center);
    width: 100%;
    min-height: 36px;

    @include breakpoint($tablet) {
      min-height: 72px;
    }
  }

  &__desktop-navigation {
    display: none;

    @include breakpoint($tablet) {
      display: block;
      margin-left: auto;
      margin-right: auto;
    }
  }

  &__mobile-navigation {
    margin-top: 7px;

    @include breakpoint($tablet) {
      display: none;
    }
  }

  &__theme-button {
    @include flexCenter;
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    padding: 0;
    color: $color-text;
    background: $color-surface;
    border: 1px solid $color-border;
    border-radius: 8px;
    cursor: pointer;
    transition: color 0.2s ease, border-color 0.2s ease;

    @include breakpoint($tablet) {
      width: 40px;
      height: 40px;
    }

    &:hover {
      color: $color-primary;
      border-color: $color-primary;
    }

    &:focus-visible {
      outline: 2px solid $color-accent;
      outline-offset: 2px;
    }
  }

  &__theme-icon {
    display: block;
  }
}
</style>