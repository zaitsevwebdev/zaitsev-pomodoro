type Theme = 'dark' | 'light'

export const useTheme = () => {
  const themeCookie = useCookie<Theme>('theme', {
    default: () => 'dark',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax'
  })

  const theme = useState<Theme>('theme', () => themeCookie.value)

  const isDarkTheme = computed(() => theme.value === 'dark')

  const handleThemeToggle = () => {
    theme.value = isDarkTheme.value ? 'light' : 'dark'
    themeCookie.value = theme.value
  }

  return {
    theme,
    isDarkTheme,
    handleThemeToggle
  }
}