import Failure from '../Failure'
import { fireEvent, render } from '@testing-library/react-native'
import * as React from 'react'
import { ErrorCode } from 'api-client'
import buildConfig from '../../constants/buildConfig'

describe('Failure', () => {
  it('should render a retry button if tryAgain is passed', () => {
    const { getByTestId } = render(
      <Failure theme={buildConfig().lightTheme} tryAgain={() => {}} code={ErrorCode.UnknownError} t={key => key} />
    )
    expect(getByTestId('button-tryAgain')).toBeTruthy()
  })
  it('should not render a retry button if tryAgain is not passed', () => {
    const { queryByTestId } = render(
      <Failure theme={buildConfig().lightTheme} code={ErrorCode.UnknownError} t={key => key} />
    )
    expect(queryByTestId('button-tryAgain')).toBeNull()
  })
  it('should have a correct message as title', () => {
    const { getByText } = render(
      <Failure theme={buildConfig().lightTheme} code={ErrorCode.UnknownError} t={key => key} />
    )
    expect(getByText(ErrorCode.UnknownError)).toBeTruthy()
  })
  it('should try again if button is pressed', () => {
    const tryAgain = jest.fn()
    const { getByTestId } = render(
      <Failure theme={buildConfig().lightTheme} code={ErrorCode.UnknownError} tryAgain={tryAgain} t={key => key} />
    )
    fireEvent.press(getByTestId('button-tryAgain'))
    expect(tryAgain).toHaveBeenCalled()
  })
})
