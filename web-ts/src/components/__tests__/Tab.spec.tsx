import React from 'react'
import Tab from '../Tab'
import { LOCAL_NEWS_TYPE, TU_NEWS_TYPE } from 'api-client'
import { renderWithRouter } from '../../testing/render'
import buildConfig from '../../constants/buildConfig'
import { ThemeProvider } from 'styled-components'

describe('Tab', () => {
  const active = true
  const destination = '/testcity/en/news/local'
  const t = key => key

  it('should render the local news tab', () => {
    const { getByText, queryByLabelText } = renderWithRouter(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <Tab type={LOCAL_NEWS_TYPE} active={active} destination={destination} t={t} />
      </ThemeProvider>
    )
    expect(getByText('LOCAL').closest('a')).toHaveProperty('href', `http://localhost${destination}`)
    expect(queryByLabelText('tuNews')).toBeFalsy()
  })

  it('should render the tünews news tab', () => {
    const { queryByText, getByLabelText } = renderWithRouter(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <Tab type={TU_NEWS_TYPE} active={active} destination={destination} t={t} />
      </ThemeProvider>
    )
    expect(getByLabelText('tuNews')).toHaveProperty('href', `http://localhost${destination}`)
    expect(queryByText('LOCAL')).toBeFalsy()
  })
})
