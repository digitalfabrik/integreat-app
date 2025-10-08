import React from 'react'

import { renderAllRoutes } from '../../testing/render'
import CityContentToolbar from '../CityContentToolbar'

jest.mock('react-i18next')

describe('CityContentToolbar', () => {
  it('should show feedback items', () => {
    const { getByText } = renderAllRoutes('/augsburg/de', {
      CityContentElement: <CityContentToolbar />,
    })
    expect(getByText('feedback:useful')).toBeTruthy()
    expect(getByText('feedback:notUseful')).toBeTruthy()
  })

  it('should hide feedback for news routes', () => {
    const { queryByText } = renderAllRoutes('/augsburg/de/news/local', {
      CityContentElement: <CityContentToolbar />,
    })
    expect(queryByText('feedback:useful')).toBeFalsy()
    expect(queryByText('feedback:notUseful')).toBeFalsy()
  })
})
