import { fireEvent, RenderAPI } from '@testing-library/react-native'
import React from 'react'

import { ErrorCode } from 'api-client'

import render from '../../testing/render'
import Failure from '../Failure'

jest.mock('react-i18next')

describe('Failure', () => {
  const renderFailure = (tryAgain?: () => void, code: ErrorCode = ErrorCode.UnknownError): RenderAPI =>
    render(<Failure code={code} buttonAction={tryAgain} />)

  it('should render a retry button if tryAgain is passed', () => {
    const { getByText } = renderFailure(() => undefined)
    expect(getByText('tryAgain')).toBeTruthy()
  })
  it('should not render a retry button if tryAgain is not passed', () => {
    const { queryByText } = renderFailure()
    expect(queryByText('tryAgain')).toBeNull()
  })
  it('should have a correct message as title', () => {
    const { getByText } = renderFailure()
    expect(getByText(ErrorCode.UnknownError)).toBeTruthy()
  })
  it('should try again if button is pressed', () => {
    const tryAgain = jest.fn()
    const { getByText } = renderFailure(tryAgain)
    fireEvent.press(getByText('tryAgain'))
    expect(tryAgain).toHaveBeenCalled()
  })
})
