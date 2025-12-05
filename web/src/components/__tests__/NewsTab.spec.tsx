import React from 'react'

import { LOCAL_NEWS_TYPE, TU_NEWS_TYPE } from 'shared'

import { renderWithRouterAndTheme } from '../../testing/render'
import NewsTab from '../NewsTab'

jest.mock('react-i18next')

describe('NewsTab', () => {
  const active = true
  const destination = '/testcity/en/news/local'

  it('should render the local news tab', () => {
    const { getByText, queryByLabelText } = renderWithRouterAndTheme(
      <NewsTab type={LOCAL_NEWS_TYPE} active={active} destination={destination} />,
    )
    expect(getByText('NEWS:LOCAL').closest('a')).toHaveProperty('href', `http://localhost${destination}`)
    expect(queryByLabelText('tuNews')).toBeFalsy()
  })

  it('should render the tünews news tab', () => {
    const { queryByText, getByLabelText } = renderWithRouterAndTheme(
      <NewsTab type={TU_NEWS_TYPE} active={active} destination={destination} />,
    )
    expect(getByLabelText('tünews INTERNATIONAL')).toHaveProperty('href', `http://localhost${destination}`)
    expect(queryByText('NEWS:LOCAL')).toBeFalsy()
  })
})
