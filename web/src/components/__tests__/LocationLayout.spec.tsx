import { render } from '@testing-library/react'
import React from 'react'
import { ThemeProvider } from 'styled-components'

import { CATEGORIES_ROUTE, CityModelBuilder } from 'api-client'

import buildConfig from '../../constants/buildConfig'
import LocationLayout, { ToolbarPropType } from '../LocationLayout'

jest.mock('../LocationFooter', () => () => <div>LocationFooter</div>)
jest.mock('../LocationHeader', () => () => <div>LocationHeader</div>)

describe('LocationLayout', () => {
  const language = 'de'
  const cityModel = new CityModelBuilder(1).build()[0]!

  const languageChangePaths = [
    { code: 'de', name: 'Deutsch', path: '/augsburg/de' },
    { code: 'en', name: 'English', path: '/augsburg/en' },
  ]

  const feedbackTargetInformation = { path: '/path/to/category' }
  const theme = buildConfig().lightTheme

  const MockNode = () => <div />
  const renderLocationLayout = (isLoading: boolean, toolbar?: ToolbarPropType) => (
    <LocationLayout
      toolbar={toolbar}
      cityModel={cityModel}
      languageCode={language}
      route={CATEGORIES_ROUTE}
      languageChangePaths={languageChangePaths}
      feedbackTargetInformation={feedbackTargetInformation}
      viewportSmall
      isLoading={isLoading}>
      <MockNode />
    </LocationLayout>
  )

  it('should render a toolbar', () => {
    const toolbar = () => 'LocationToolbar'

    const { getByText } = render(<ThemeProvider theme={theme}>{renderLocationLayout(false, toolbar)}</ThemeProvider>)
    expect(getByText('LocationToolbar')).toBeTruthy()
  })

  it('should show LocationHeader and LocationFooter if not loading', () => {
    const { getByText } = render(<ThemeProvider theme={theme}>{renderLocationLayout(false)}</ThemeProvider>)
    expect(getByText('LocationHeader')).toBeTruthy()
    expect(getByText('LocationFooter')).toBeTruthy()
  })

  it('should not render LocationFooter if loading', () => {
    const { getByText } = render(<ThemeProvider theme={theme}>{renderLocationLayout(true)}</ThemeProvider>)
    expect(getByText('LocationHeader')).toBeTruthy()
    expect(() => getByText('LocationFooter')).toThrow()
  })
})
