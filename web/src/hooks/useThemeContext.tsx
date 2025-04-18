import { useContext } from 'react'

import { ThemeContext, ThemeContextType } from '../components/ThemeContext'

export const useThemeContext = (): ThemeContextType => useContext(ThemeContext)
