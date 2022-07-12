import { act, render } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import SnackbarContainer from '../SnackbarContainer'

jest.useFakeTimers()

jest.mock('react-i18next')
jest.mock('../../components/Snackbar', () => {
  const { Text } = require('react-native')

  return ({ message }: { message: string }) => <Text>{message}</Text>
})
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn()
}))

describe('SnackbarContainer', () => {
  const mockDispatch = jest.fn()
  const mockUseSelector = mocked(useSelector)
  const mockUseDispatch = mocked(useDispatch)

  beforeEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
    mockUseDispatch.mockImplementation(() => mockDispatch)
  })

  it('should show a snackbar if included in the state', () => {
    mockUseSelector.mockImplementation(() => [])
    const snackbarText1 = 'snackbarText1'
    const snackbarText2 = 'snackbarText2'
    const { update, queryByText } = render(<SnackbarContainer />)
    expect(queryByText(snackbarText1)).toBeFalsy()
    expect(queryByText(snackbarText2)).toBeFalsy()

    // Simulate two new snackbars have been pushed to the redux store
    mockUseSelector.mockImplementation(() => [
      {
        text: snackbarText1
      },
      {
        text: snackbarText2
      }
    ])
    update(<SnackbarContainer />)

    // First snackbar should be remove from redux store
    expect(mockDispatch).toHaveBeenCalledTimes(1)
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'DEQUEUE_SNACKBAR'
    })
    // Simulate pop of snackbar from the redux store (triggered by DEQUEUE_SNACKBAR action)
    mockUseSelector.mockImplementation(() => [
      {
        text: snackbarText2
      }
    ])
    update(<SnackbarContainer />)
    expect(queryByText(snackbarText1)).toBeTruthy()
    expect(queryByText(snackbarText2)).toBeFalsy()

    act(() => {
      // 5000 (show duration) + 300 (animation duration)
      jest.advanceTimersByTime(5300)
    })

    // Second snackbar should be shown and removed from redux store
    expect(mockDispatch).toHaveBeenCalledTimes(2)
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'DEQUEUE_SNACKBAR'
    })
    // Simulate pop of snackbar from the redux store (triggered by DEQUEUE_SNACKBAR action)
    mockUseSelector.mockImplementation(() => [])
    update(<SnackbarContainer />)
    expect(queryByText(snackbarText1)).toBeFalsy()
    expect(queryByText(snackbarText2)).toBeTruthy()

    act(() => {
      // 5000 (show duration) + 300 (animation duration)
      jest.advanceTimersByTime(5300)
    })

    // No snackbar should be shown anymore
    expect(queryByText(snackbarText1)).toBeFalsy()
    expect(queryByText(snackbarText2)).toBeFalsy()
  })
})
