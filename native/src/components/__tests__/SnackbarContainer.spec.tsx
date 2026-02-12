import { act, waitFor } from '@testing-library/react-native'
import React, { useContext } from 'react'
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock'

import renderWithTheme from '../../testing/render'
import SnackbarContainer, { SnackbarContext } from '../SnackbarContainer'

jest.mock('react-native-safe-area-context', () => mockSafeAreaContext)
jest.mock('react-i18next')

describe('SnackbarContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  let enqueueSnackbar = jest.fn()

  const MockComponent = () => {
    enqueueSnackbar = jest.fn(useContext(SnackbarContext))
    return null
  }

  const MockComponentWithSnackbar = () => (
    <SnackbarContainer>
      <MockComponent />
    </SnackbarContainer>
  )

  it('should show first snackbar when multiple are enqueued', () => {
    const snackbarText1 = 'snackbarText1'
    const snackbarText2 = 'snackbarText2'
    const { update, queryByText } = renderWithTheme(<MockComponentWithSnackbar />, false)
    expect(queryByText(snackbarText1)).toBeFalsy()
    expect(queryByText(snackbarText2)).toBeFalsy()

    act(() => {
      enqueueSnackbar({ text: snackbarText1 })
      enqueueSnackbar({ text: snackbarText2 })
    })
    update(<MockComponentWithSnackbar />)

    // First snackbar should be visible, second should be queued
    expect(queryByText(snackbarText1)).toBeTruthy()
    expect(queryByText(snackbarText2)).toBeFalsy()
  })

  it('should show next snackbar after first one is dismissed', async () => {
    const snackbarText1 = 'snackbarText1'
    const snackbarText2 = 'snackbarText2'
    const { update, queryByText } = renderWithTheme(<MockComponentWithSnackbar />, false)

    act(() => {
      enqueueSnackbar({ text: snackbarText1, duration: 100 })
      enqueueSnackbar({ text: snackbarText2, duration: 100 })
    })
    update(<MockComponentWithSnackbar />)

    expect(queryByText(snackbarText1)).toBeTruthy()

    // Wait for first snackbar to dismiss and second to appear
    await waitFor(
      () => {
        update(<MockComponentWithSnackbar />)
        expect(queryByText(snackbarText2)).toBeTruthy()
      },
      { timeout: 500 },
    )
  })
})
