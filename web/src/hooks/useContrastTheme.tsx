import { useContext } from 'react'

import { ContrastThemeContext, ContrastThemeContextType } from '../components/ContrastThemeContext'

export const useContrastTheme = (): ContrastThemeContextType => useContext(ContrastThemeContext)
