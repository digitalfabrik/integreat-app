import React from 'react'

import { renderAllRoutes } from '../../testing/render'
import RegionContentToolbar from '../RegionContentToolbar'

jest.mock('react-i18next')

describe('RegionContentToolbar', () => {
  it('should show feedback items', () => {
    const { getByText } = renderAllRoutes('/augsburg/de', {
      RegionContentElement: <RegionContentToolbar />,
    })
    expect(getByText('feedback:useful')).toBeTruthy()
    expect(getByText('feedback:notUseful')).toBeTruthy()
  })

  it('should hide feedback for news routes', () => {
    const { queryByText } = renderAllRoutes('/augsburg/de/news/local', {
      RegionContentElement: <RegionContentToolbar />,
    })
    expect(queryByText('feedback:useful')).toBeFalsy()
    expect(queryByText('feedback:notUseful')).toBeFalsy()
  })
})
