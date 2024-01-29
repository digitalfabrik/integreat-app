import { TFunction } from 'i18next'
import React from 'react'
import { ThemeProvider } from 'styled-components'

import { LOCAL_NEWS_TYPE, TU_NEWS_TYPE } from 'shared'
import { UiDirectionType } from 'translations'

import buildConfig from '../../constants/buildConfig'
import { renderWithRouter } from '../../testing/render'
import NewsTab from '../NewsTab'

jest.mock('react-inlinesvg')
jest.mock('react-i18next')

describe('NewsTab', () => {
  const active = true
  const destination = '/testcity/en/news/local'
  const t = ((key: string) => key) as TFunction
  const theme = { ...buildConfig().lightTheme, contentDirection: 'ltr' as UiDirectionType }

  it('should render the local news tab', () => {
    const { getByText, queryByLabelText } = renderWithRouter(
      <ThemeProvider theme={theme}>
        <NewsTab type={LOCAL_NEWS_TYPE} active={active} destination={destination} t={t} />
      </ThemeProvider>,
    )
    expect(getByText('LOCAL').closest('a')).toHaveProperty('href', `http://localhost${destination}`)
    expect(queryByLabelText('tuNews')).toBeFalsy()
  })

  it('should render the tünews news tab', () => {
    const { queryByText, getByLabelText } = renderWithRouter(
      <ThemeProvider theme={theme}>
        <NewsTab type={TU_NEWS_TYPE} active={active} destination={destination} t={t} />
      </ThemeProvider>,
    )
    expect(getByLabelText('tünews INTERNATIONAL')).toHaveProperty('href', `http://localhost${destination}`)
    expect(queryByText('LOCAL')).toBeFalsy()
  })
})
