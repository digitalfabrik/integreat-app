import { DefaultTheme, type Theme as NavigationTheme } from '@react-navigation/native'
import { useTheme } from 'styled-components/native'

export const useNavigationTheme = (): NavigationTheme => {
  const theme = useTheme()
  return {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      card: theme.colors.background,
    },
  }
}
