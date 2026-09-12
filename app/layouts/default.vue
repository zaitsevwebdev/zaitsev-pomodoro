<script setup lang="ts">
import SettingsPanel from '~/components/SettingsPanel.vue'
import { useTheme } from '~/composables/useTheme'
import { useSettings } from '~/composables/useSettings'

const themeState = useTheme()
const settingsState = useSettings()

console.log('useTheme result:', themeState)
console.log('useSettings result:', settingsState)

const { theme, isDarkTheme } = themeState
const { settings, accentOptions } = settingsState

const settingsPanel = ref<InstanceType<typeof SettingsPanel> | null>(null)

const accentStyle = computed(() => {
  const accent = accentOptions.find(
    option => option.id === settings.value.accent,
  ) ?? accentOptions[0]

  const primary = isDarkTheme.value ? accent.dark : accent.light
  const hover = isDarkTheme.value ? accent.darkHover : accent.lightHover

  return {
    '--color-primary': primary,
    '--color-primary-dark': hover,
    '--color-accent': primary,
    '--color-text-dark': isDarkTheme.value ? '#141614' : '#ffffff',
  }
})
</script>

<template>
  <div
    class="app"
    :class="`app--${theme}`"
    :data-accent="settings.accent"
    :style="accentStyle"
  >
    <TheHeader @open-settings="settingsPanel?.open()" />

    <div class="app__content">
      <NuxtPage />
    </div>

    <TheFooter />

    <SettingsPanel ref="settingsPanel" />
  </div>
</template>

<style lang="scss">
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100svh;
    color: $color-text;
    background: $color-bg;

    &__content {
      display: flex;
      flex: 1;
      flex-direction: column;
      min-width: 0;

      > * {
        flex: 1;
      }
    }
  }
</style>