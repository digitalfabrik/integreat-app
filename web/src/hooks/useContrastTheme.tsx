import { useContext } from 'react'

import { ThemeContext, ThemeContextType } from '../components/ThemeContext'

export const useContrastTheme = (): ThemeContextType => useContext(ThemeContext)
