const accentOptions = [
  {
    id: 'lime',
    name: 'Lime',
    dark: '#c8ff3d',
    darkHover: '#a7dc1f',
    light: '#4d7000',
    lightHover: '#3e5c00',
  },
  {
    id: 'sky',
    name: 'Sky',
    dark: '#78b4ff',
    darkHover: '#9bc8ff',
    light: '#245fcc',
    lightHover: '#1c4da8',
  },
  {
    id: 'lavender',
    name: 'Lavender',
    dark: '#b69aff',
    darkHover: '#cbb7ff',
    light: '#7040c0',
    lightHover: '#5b339e',
  },
  {
    id: 'mint',
    name: 'Mint',
    dark: '#68ddb5',
    darkHover: '#91e7ca',
    light: '#08785d',
    lightHover: '#066149',
  },
  {
    id: 'rose',
    name: 'Rose',
    dark: '#f49ab5',
    darkHover: '#f8b7ca',
    light: '#b52d60',
    lightHover: '#95254e',
  },
  {
    id: 'sand',
    name: 'Sand',
    dark: '#e7c58e',
    darkHover: '#efd7b0',
    light: '#855b20',
    lightHover: '#6b491a',
  },
] as const

type Accent = (typeof accentOptions)[number]['id']
type DurationKey = 'focus' | 'shortBreak' | 'longBreak'
type AutoStartKey = 'autoStartFocus' | 'autoStartBreaks'

interface Settings {
  accent: Accent
  focus: number
  shortBreak: number
  longBreak: number
  autoStartFocus: boolean
  autoStartBreaks: boolean
}

const defaults: Settings = {
  accent: 'lime',
  focus: 25,
  shortBreak: 5,
  longBreak: 15,
  autoStartFocus: false,
  autoStartBreaks: false,
}

function normalizeMinutes(value: unknown, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.min(180, Math.max(1, Math.round(value)))
    : fallback
}

function normalizeSettings(value: unknown): Settings {
  const saved = value && typeof value === 'object'
    ? value as Record<string, unknown>
    : {}

  const accent = accentOptions.find(option => option.id === saved.accent)

  return {
    accent: accent?.id ?? defaults.accent,
    focus: normalizeMinutes(saved.focus, defaults.focus),
    shortBreak: normalizeMinutes(saved.shortBreak, defaults.shortBreak),
    longBreak: normalizeMinutes(saved.longBreak, defaults.longBreak),
    autoStartFocus: saved.autoStartFocus === true,
    autoStartBreaks: saved.autoStartBreaks === true,
  }
}

export const useSettings = () => {
  const settingsCookie = useCookie<Settings>('pomodoro-settings', {
    default: () => ({ ...defaults }),
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    path: '/',
  })

  const settings = useState<Settings>('pomodoro-settings', () =>
    normalizeSettings(settingsCookie.value),
  )

  const saveSettings = (patch: Partial<Settings>) => {
    settings.value = normalizeSettings({
      ...settings.value,
      ...patch,
    })

    settingsCookie.value = { ...settings.value }
  }

  const setAccent = (accent: Accent) => {
    saveSettings({ accent })
  }

  const setDuration = (key: DurationKey, minutes: number) => {
    saveSettings({ [key]: normalizeMinutes(minutes, settings.value[key]) })
  }

  const toggleAutoStart = (key: AutoStartKey) => {
    saveSettings({ [key]: !settings.value[key] })
  }

  return {
    settings: readonly(settings),
    accentOptions,
    setAccent,
    setDuration,
    toggleAutoStart,
  }
}