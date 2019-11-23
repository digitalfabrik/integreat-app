// @flow

import Failure from '../Failure'
import { fireEvent, render } from '@testing-library/react-native'
import * as React from 'react'
import { brightTheme } from '../../../theme/constants/theme'
import { ErrorCodes } from '../../ErrorCode'

describe('Failure', () => {
  it('should render a retry button if tryAgain is passed', () => {
    const { getByTestId } = render(<Failure theme={brightTheme} tryAgain={() => {}} code={ErrorCodes.UnknownError}
                                            t={key => key} />)

    expect(getByTestId('button-tryAgain')).toBeTruthy()
  })

  it('should not render a retry button if tryAgain is not passed', () => {
    const { queryByTestId } = render(<Failure theme={brightTheme} code={ErrorCodes.UnknownError} t={key => key} />)

    expect(queryByTestId('button-tryAgain')).toBeNull()
  })

  it('should have a correct message as title', () => {
    const { getByText } = render(<Failure theme={brightTheme} code={ErrorCodes.UnknownError}
                                          t={key => key} />)

    expect(getByText(ErrorCodes.UnknownError)).toBeTruthy()
  })

  it('should try again if button is pressed', () => {
    const tryAgain = jest.fn()
    const { getByTestId } = render(<Failure theme={brightTheme} code={ErrorCodes.UnknownError} tryAgain={tryAgain}
                                            t={key => key} />)
    fireEvent.press(getByTestId('button-tryAgain'))
    expect(tryAgain).toHaveBeenCalled()
  })
})
