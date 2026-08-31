<script setup lang="ts">
interface Props {
  portfolioUrl: string
  githubUrl: string
  supportUrl: string
}

defineProps<Props>()
</script>

<template>
  <footer class="the-footer">
    <div class="the-footer__container">
      <p class="the-footer__author">
        Created by Zaitsev
      </p>

      <nav
        class="the-footer__navigation"
        aria-label="Додаткова навігація"
      >
        <a
          class="the-footer__link"
          :href="portfolioUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          Portfolio
        </a>

        <a
          class="the-footer__link"
          :href="githubUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>

        <a
          class="the-footer__link"
          :href="supportUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          Buy me a coffee
        </a>
      </nav>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.the-footer {
  width: 100%;
  background: $color-footer;
  border-top: 1px solid $color-border;

  &__container {
    display: grid;
    width: 100%;
    max-width: $desktopLarge;
    gap: 18px;
    margin: 0 auto;
    padding: 18px 14px;

    @include breakpoint($mobile) {
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      gap: 40px;
      padding: 18px 30px;
    }
  }

  &__author {
    margin: 0;
    white-space: nowrap;
    @include font(8px, 1.4, $mainFontName, $color-text-secondary, 400);
  }

  &__navigation {
    display: grid;
    gap: 10px;

    @include breakpoint($mobile) {
      @include flex(flex-end, center);
      gap: 24px;
    }
  }

  &__link {
    width: fit-content;
    text-decoration: none;
    @include font(8px, 1.4, $mainFontName, $color-text-secondary, 400);
    transition: color 0.2s ease;

    &:hover {
      color: $color-primary;
    }

    &:focus-visible {
      color: $color-primary;
      outline: 2px solid $color-primary;
      outline-offset: 3px;
      border-radius: 2px;
    }
  }
}
</style>