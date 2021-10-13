import { render } from '@testing-library/react-native'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { mocked } from 'ts-jest/utils'

import SnackbarContainer from '../SnackbarContainer'

jest.useFakeTimers()

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

  it('should show a snackbar if included in the state', async () => {
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
    await update(<SnackbarContainer />)
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
    await update(<SnackbarContainer />)
    expect(queryByText(snackbarText1)).toBeTruthy()
    expect(queryByText(snackbarText2)).toBeFalsy()
    jest.advanceTimersByTime(5000)
    expect(mockDispatch).toHaveBeenCalledTimes(2)
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'DEQUEUE_SNACKBAR'
    })
    // Simulate pop of snackbar from the redux store (triggered by DEQUEUE_SNACKBAR action)
    mockUseSelector.mockImplementation(() => [])
    await update(<SnackbarContainer />)
    expect(queryByText(snackbarText1)).toBeFalsy()
    expect(queryByText(snackbarText2)).toBeTruthy()
    jest.advanceTimersByTime(5000)
    expect(queryByText(snackbarText1)).toBeFalsy()
    expect(queryByText(snackbarText2)).toBeFalsy()
  })
})
