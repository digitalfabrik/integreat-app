import { fireEvent, render } from '@testing-library/react-native'
import * as React from 'react'

import { ErrorCode } from 'api-client'

import buildConfig from '../../constants/buildConfig'
import Failure from '../Failure'

jest.mock('react-i18next')
jest.mock('styled-components', () => ({
  ...jest.requireActual('styled-components'),
  useTheme: () => buildConfig().lightTheme
}))

describe('Failure', () => {
  it('should render a retry button if tryAgain is passed', () => {
    const { getByTestId } = render(<Failure tryAgain={() => {}} code={ErrorCode.UnknownError} />)
    expect(getByTestId('button-tryAgain')).toBeTruthy()
  })
  it('should not render a retry button if tryAgain is not passed', () => {
    const { queryByTestId } = render(<Failure code={ErrorCode.UnknownError} />)
    expect(queryByTestId('button-tryAgain')).toBeNull()
  })
  it('should have a correct message as title', () => {
    const { getByText } = render(<Failure code={ErrorCode.UnknownError} />)
    expect(getByText(ErrorCode.UnknownError)).toBeTruthy()
  })
  it('should try again if button is pressed', () => {
    const tryAgain = jest.fn()
    const { getByTestId } = render(<Failure code={ErrorCode.UnknownError} tryAgain={tryAgain} />)
    fireEvent.press(getByTestId('button-tryAgain'))
    expect(tryAgain).toHaveBeenCalled()
  })
})
