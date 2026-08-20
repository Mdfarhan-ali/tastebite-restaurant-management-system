export const THEME = {
  colors: {
    primary: 'bg-red-600',
    primaryHover: 'hover:bg-red-700',

    secondary: 'bg-amber-400',

    dark: 'bg-gray-900',

    white: 'bg-white',

    textPrimary: 'text-gray-900',

    textSecondary: 'text-gray-600'
  },

  spacing: {
    section: 'py-24',

    container: 'px-6 lg:px-8',

    maxWidth: 'max-w-7xl'
  },

  radius: {
    sm: 'rounded-lg',

    md: 'rounded-xl',

    lg: 'rounded-2xl'
  },

  shadow: {
    sm: 'shadow-md',

    md: 'shadow-lg',

    lg: 'shadow-xl'
  }
} as const;