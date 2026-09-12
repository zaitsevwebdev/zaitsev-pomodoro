type Theme = 'dark' | 'light'

export const useTheme = () => {
  const themeCookie = useCookie<Theme>('theme', {
    default: () => 'dark',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    path: '/',
  })

  const theme = useState<Theme>('theme', () =>
    themeCookie.value === 'light' ? 'light' : 'dark',
  )

  const isDarkTheme = computed(() => theme.value === 'dark')

  const handleSetTheme = (value: Theme) => {
    theme.value = value
    themeCookie.value = value
  }

  const handleThemeToggle = () => {
    handleSetTheme(isDarkTheme.value ? 'light' : 'dark')
  }

  return {
    theme, 
    isDarkTheme,
    handleSetTheme,
    handleThemeToggle,
  }
}