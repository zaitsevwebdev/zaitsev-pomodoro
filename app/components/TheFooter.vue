<script setup lang="ts">
const urls = {
  portfolioUrl: 'https://zaitsevwebdevportfolio.vercel.app/',
  githubUrl: 'https://github.com/zaitsevwebdev',
  supportUrl: 'https://www.buymeacoffee.com/zaitsevwebdev',
}
</script>

<template>
  <footer class="the-footer">
    <div class="the-footer__container">
      <p class="the-footer__author">
        Created by <span>Zaitsev</span>
      </p>

      <nav
        class="the-footer__navigation"
        aria-label="Додаткова навігація"
      >
        <a
          class="the-footer__link"
          :href="urls.portfolioUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          Portfolio
        </a>

        <a
          class="the-footer__link"
          :href="urls.githubUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>

        <a
          class="the-footer__link"
          :href="urls.supportUrl"
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
    flex-shrink: 0;
    width: 100%;
    background: $color-footer;
    border-top: 1px solid $color-border;
    color: $color-text;
    font-family: $mainFontName;

    &,
    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    &__container {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      max-width: $desktopLarge;
      gap: 12px;
      margin-inline: auto;
      padding: 24px 20px;

      @include breakpoint($tablet) {
        flex-direction: row;
        justify-content: space-between;
        gap: 32px;
        min-height: 80px;
        padding: 18px 30px;
      }
    }

    &__author {
      margin: 0;
      color: $color-text-secondary;
      font-size: 14px;
      line-height: 1.6;
      white-space: nowrap;

      span {
        color: $color-text;
        font-weight: 500;
      }
    }

    &__navigation {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      gap: 4px 16px;

      @include breakpoint($mobile) {
        column-gap: 24px;
      }

      @include breakpoint($tablet) {
        justify-content: flex-end;
        column-gap: 28px;
      }
    }

    &__link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 44px;
      padding: 8px 2px;
      color: $color-text;
      font-size: 14px;
      font-weight: 400;
      line-height: 1.5;
      text-decoration: none;
      transition: color 0.2s ease;

      &:hover {
        color: $color-primary;
      }

      &:focus-visible {
        outline: 2px solid $color-primary;
        outline-offset: 4px;
        border-radius: 4px;
      }

      @media (prefers-reduced-motion: reduce) {
        transition: none;
      }
    }
  }
</style>