import { useNavigation } from '@react-navigation/native'
import React from 'react'

import createNavigationPropMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import useSetRouteTitle from '../useSetRouteTitle'

jest.mock('@react-navigation/native')

describe('useSetRouteTitle', () => {
  const { mocked } = jest
  const navigation = createNavigationPropMock()

  beforeEach(() => {
    jest.clearAllMocks()
    mocked(useNavigation).mockImplementation(() => navigation as never)
  })

  const MockComponent = ({ title }: { title?: string }) => {
    useSetRouteTitle(title)
    return null
  }

  it('should set the title of the current route', () => {
    render(<MockComponent title='My Title' />, false)
    expect(navigation.setParams).toHaveBeenCalledWith({ title: 'My Title' })
  })

  it('should not set a title if it is not available yet', () => {
    render(<MockComponent />, false)
    expect(navigation.setParams).not.toHaveBeenCalled()
  })
})
