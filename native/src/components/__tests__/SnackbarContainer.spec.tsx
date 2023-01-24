import { act, render } from '@testing-library/react-native'
import React, { useContext } from 'react'

import SnackbarContainer, { SnackbarContext } from '../SnackbarContainer'

jest.useFakeTimers()

jest.mock('react-i18next')
jest.mock('../../components/Snackbar', () => {
  const { Text } = require('react-native')

  return ({ text }: { text: string }) => <Text>{text}</Text>
})

describe('SnackbarContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
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

  it('should show a snackbar if included in the state', () => {
    const snackbarText1 = 'snackbarText1'
    const snackbarText2 = 'snackbarText2'
    const { update, queryByText } = render(<MockComponentWithSnackbar />)
    expect(queryByText(snackbarText1)).toBeFalsy()
    expect(queryByText(snackbarText2)).toBeFalsy()

    act(() => {
      enqueueSnackbar({ text: snackbarText1 })
      enqueueSnackbar({ text: snackbarText2 })
    })
    update(<MockComponentWithSnackbar />)

    expect(queryByText(snackbarText1)).toBeTruthy()
    expect(queryByText(snackbarText2)).toBeFalsy()

    act(() => {
      // 5000 (show duration) + 300 (animation duration)
      jest.advanceTimersByTime(5300)
    })

    update(<MockComponentWithSnackbar />)

    act(() => {
      expect(queryByText(snackbarText1)).toBeFalsy()
      expect(queryByText(snackbarText2)).toBeTruthy()
    })

    act(() => {
      // 5000 (show duration) + 300 (animation duration)
      jest.advanceTimersByTime(5300)
    })

    // No snackbar should be shown anymore
    expect(queryByText(snackbarText1)).toBeFalsy()
    expect(queryByText(snackbarText2)).toBeFalsy()
  })
})
