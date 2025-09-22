import React from 'react'

import { renderWithRouterAndTheme } from '../../testing/render'
import GeneralFooter from '../GeneralFooter'

jest.mock('react-i18next')

describe('GeneralFooter', () => {
  it('should show links', () => {
    const { getByText } = renderWithRouterAndTheme(<GeneralFooter language='de' />)
    expect(getByText('layout,settings:disclaimer')).toBeDefined()
    expect(getByText('layout,settings:settings:aboutUs')).toBeDefined()
    expect(getByText('layout,settings:privacy')).toBeDefined()
    expect(getByText('layout,settings:settings:openSourceLicenses')).toBeDefined()
    expect(getByText('layout,settings:accessibility')).toBeDefined()
  })
})
