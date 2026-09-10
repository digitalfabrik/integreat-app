import React from 'react'

import { renderAllRoutes } from '../../testing/render'
import RegionContentToolbar from '../RegionContentToolbar'

describe('RegionContentToolbar', () => {
  it('should show feedback items', () => {
    const { getByText } = renderAllRoutes('/augsburg/de', {
      RegionContentElement: <RegionContentToolbar />,
    })
    expect(getByText('feedback:rating.useful')).toBeTruthy()
    expect(getByText('feedback:rating.notUseful')).toBeTruthy()
  })

  it('should hide feedback for news routes', () => {
    const { queryByText } = renderAllRoutes('/augsburg/de/news/local', {
      RegionContentElement: <RegionContentToolbar />,
    })
    expect(queryByText('feedback:rating.useful')).toBeFalsy()
    expect(queryByText('feedback:rating.notUseful')).toBeFalsy()
  })
})
