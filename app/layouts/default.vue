<script setup lang="ts">
const {
  theme,
  isDarkTheme,
  handleThemeToggle
} = useTheme()
</script>

<template>
  <div
    class="app"
    :class="`app--${theme}`"
  >
    <TheHeader
      :is-dark-theme="isDarkTheme"
      @toggle-theme="handleThemeToggle"
    />
  
    <NuxtPage />

    <TheFooter
      portfolio-url="https://zaitsevwebdevportfolio.vercel.app/"
      github-url="https://github.com/zaitsevwebdev"
      support-url="https://www.buymeacoffee.com/zaitsevwebdev"
    />
  </div>
</template>

<style lang="scss">
.app {
  color: $color-text;
  background: $color-bg;
  transition: color 0.25s ease, background 0.25s ease;
}
</style>