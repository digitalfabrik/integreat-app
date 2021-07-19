import React from 'react'
import { render } from '@testing-library/react-native'

import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'
import LanguageModelBuilder from 'api-client/src/testing/LanguageModelBuilder'
import buildConfig from '../../constants/buildConfig'
import Header from '../Header'

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const t = key => key
  const goToLanguageChange = jest.fn()
  const dispatch = jest.fn()
  const [city] = new CityModelBuilder(1).build()
  const language = new LanguageModelBuilder(1).build()[0]

  const buildProps = (peeking: boolean, categoriesAvailable: boolean, mode: 'float' | 'screen', goToLanguageChange) => {
    return {
      t,
      theme: buildConfig().lightTheme,
      peeking,
      categoriesAvailable,
      goToLanguageChange,
      routeCityModel: city,
      language,
      shareUrl: 'testUrl',
      dispatch,
      mode,
      layout: { width: 300, height: 300 },
      insets: { top: 20, left: 20, right: 20, bottom: 20 },
      scene: undefined,
      previous: undefined,
      navigation: undefined,
      styleInterpolator: undefined
    }
  }
  // TODO fix mocking data
  it('should set opacity to material header buttons to one after loading was finished', async () => {
    // @ts-ignore
    const { getByLabelText } = render(<Header {...buildProps(false, true, 'screen', goToLanguageChange)} />)
    expect(getByLabelText('search')).toHaveStyle({ opacity: 1 })
    expect(getByLabelText('changeLanguage')).toHaveStyle({ opacity: 1 })
  })
  it('should set opacity to material header buttons to zero while loading', () => {
    // @ts-ignore
    const { getByLabelText } = render(<Header {...buildProps(true, true, 'screen', undefined)} />)
    expect(getByLabelText('search')).toHaveStyle({ opacity: 0 })
    expect(getByLabelText('changeLanguage')).toHaveStyle({ opacity: 0 })
  })
})
