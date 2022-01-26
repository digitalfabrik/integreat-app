import { render, RenderAPI, RenderOptions } from '@testing-library/react-native'
import { ReactElement } from 'react'

import wrapWithTheme from './wrapWithTheme'

const renderWithTheme = (component: ReactElement, options?: RenderOptions): RenderAPI =>
  render(component, { wrapper: wrapWithTheme, ...options })

export default renderWithTheme
