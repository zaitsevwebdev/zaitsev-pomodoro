<template>
  <NuxtLink
    class="site-logo"
    to="/"
    aria-label="Zaitsev Pomodoro - на головну"
  >
    <span class="site-logo__name">Z</span>
    <span class="site-logo__accent" aria-hidden="true">Λ</span>
    <span class="site-logo__name">ITSEV</span>
    <span class="site-logo__pomodoro">.POMODORO</span>
  </NuxtLink>
</template>

<style scoped lang="scss">
.site-logo {
  @include flex(flex-start, center);
  flex-shrink: 0;
  text-decoration: none;

  &__accent {
    @include font(13px, 1, $mainFontName, $color-primary, 800);
    letter-spacing: 1px;

    @include breakpoint($tablet) {
      @include font(15px, 1, $mainFontName, $color-primary, 800);
    }
  }

  &__name {
    @include font(13px, 1, $mainFontName, $color-text, 800);
    letter-spacing: 1px;

    @include breakpoint($tablet) {
      @include font(15px, 1, $mainFontName, $color-text, 800);
    }
  }

  &__pomodoro {
    @include font(13px, 1, $mainFontName, $color-accent-pomodoro, 800);
    letter-spacing: 1px;

    @include breakpoint($tablet) {
      @include font(15px, 1, $mainFontName, $color-accent-pomodoro, 800);
    }
  }
}
</style>