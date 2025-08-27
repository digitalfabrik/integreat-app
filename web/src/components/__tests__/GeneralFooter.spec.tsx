import React from 'react'

import { renderWithRouterAndTheme } from '../../testing/render'
import GeneralFooter from '../GeneralFooter'

jest.mock('react-i18next')

describe('GeneralFooter', () => {
  it('should show links', () => {
    const { getByText } = renderWithRouterAndTheme(<GeneralFooter language='de' />)
    expect(getByText('layout:imprint')).toBeDefined()
    expect(getByText('layout:settings:about')).toBeDefined()
    expect(getByText('layout:privacy')).toBeDefined()
  })
})
