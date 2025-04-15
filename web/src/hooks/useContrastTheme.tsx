import { useContext } from 'react'

import { ContrastThemeContext, ContrastThemeContextType } from '../components/ContrastThemeContext'

export const useContrastTheme = (): ContrastThemeContextType => {
  return useContext(ContrastThemeContext)
}
