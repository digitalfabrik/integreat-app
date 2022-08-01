import { render, waitFor } from '@testing-library/react-native'
import React from 'react'

import { CATEGORIES_ROUTE } from 'api-client'

import useClearRouteOnClose from '../useClearRouteOnClose'

describe('useClearRouteOnClose', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const dispatch = jest.fn()
  const route = {
    key: 'route-id-0',
    params: undefined,
    name: CATEGORIES_ROUTE,
  }

  const MockComponent = ({ clearRouteOnClose }: { clearRouteOnClose: boolean }) => {
    useClearRouteOnClose(route, dispatch, clearRouteOnClose)
    return null
  }

  it('should clear route on close', async () => {
    const { unmount } = render(<MockComponent clearRouteOnClose />)
    expect(dispatch).not.toHaveBeenCalled()

    unmount()

    await waitFor(() => expect(dispatch).toHaveBeenCalledTimes(1))
    expect(dispatch).toHaveBeenCalledWith({
      type: 'CLEAR_ROUTE',
      params: {
        key: route.key,
      },
    })
  })

  it('should not clear route on close', async () => {
    const { unmount } = render(<MockComponent clearRouteOnClose={false} />)
    expect(dispatch).not.toHaveBeenCalled()

    unmount()

    await waitFor(() => expect(dispatch).not.toHaveBeenCalledTimes(1))
  })
})
