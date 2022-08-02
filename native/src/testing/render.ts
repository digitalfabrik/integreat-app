import { render, RenderAPI } from '@testing-library/react-native'
import { ReactElement } from 'react'

import wrapWithTheme from './wrapWithTheme'

const renderWithTheme = (component: ReactElement): RenderAPI => render(component, { wrapper: wrapWithTheme })

export default renderWithTheme
