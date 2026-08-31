<script setup lang="ts">
interface NavigationItem {
  label: string
  href: string
}

const navigationItems: NavigationItem[] = [
  {
    label: 'Pomodoro',
    href: '/'
  },
  {
    label: 'Timer',
    href: '/timer'
  },
  {
    label: 'Stopwatch',
    href: '/stopwatch'
  },
  {
    label: 'Clock',
    href: '/clock'
  },
  {
    label: 'About',
    href: '/about'
  }
]
</script>

<template>
  <nav
    class="header-navigation"
    aria-label="Основна навігація"
  >
    <NuxtLink
      v-for="item in navigationItems"
      :key="item.href"
      class="header-navigation__link"
      :to="item.href"
      exact-active-class="header-navigation__link--active"
    >
      {{ item.label }}
    </NuxtLink>
  </nav>
</template>

<style scoped lang="scss">
.header-navigation {
  @include flex(center, center);
  gap: 4px;
  overflow-x: auto;
  scrollbar-width: none;

  @include breakpoint($mobile) {
    gap: 8px;
  }

  @include breakpoint($tablet) {
    gap: 10px;
    overflow: visible;
  }

  &::-webkit-scrollbar {
    display: none;
  }

  &__link {
    padding: 10px 9px;
    flex-shrink: 0;
    white-space: nowrap;
    text-decoration: none;
    border-radius: 8px;
    @include font(10px, 1.2, $mainFontName, $color-text-secondary, 400);
    transition: color 0.2s ease, background 0.2s ease;

    @include breakpoint($mobile) {
      @include font(11px, 1.2, $mainFontName, $color-text-secondary, 400);
    }

    @include breakpoint($tablet) {
      padding: 12px 14px;
      @include font(13px, 1.2, $mainFontName, $color-text-secondary, 400);
    }

    &:hover {
      color: $color-text;
    }

    &:focus-visible {
      outline: 2px solid $color-accent;
      outline-offset: 2px;
    }

    &--active {
      color: $color-text;
      background: $color-surface;
      border: 1px solid $color-border;
    }
  }
}
</style>