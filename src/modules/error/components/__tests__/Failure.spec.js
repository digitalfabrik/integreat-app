// @flow

import Failure from '../Failure'
import { fireEvent, render } from '@testing-library/react-native'
import * as React from 'react'
import { brightTheme } from '../../../theme/constants/theme'

describe('Failure', () => {
  it('should render a retry button if tryAgain is passed', () => {
    const { getByTestId } = render(<Failure theme={brightTheme} tryAgain={() => {}} t={key => key} />)

    expect(getByTestId('button-tryAgain')).toBeTruthy()
  })

  it('should not render a retry button if tryAgain is not passed', () => {
    const { queryByTestId } = render(<Failure theme={brightTheme} t={key => key} />)

    expect(queryByTestId('button-tryAgain')).toBeNull()
  })

  it('should have a correct message as title', () => {
    const { getByText } = render(<Failure theme={brightTheme} errorMessage={'error-message'}
                                          t={key => key} />)

    expect(getByText('error-message')).toBeTruthy()
  })

  it('should have a general title if there is no error instance', () => {
    const { getByText } = render(<Failure theme={brightTheme} t={key => key} />)

    expect(getByText('generalError')).toBeTruthy()
  })

  it('should try again if button is pressed', () => {
    const tryAgain = jest.fn()
    const { getByTestId } = render(<Failure theme={brightTheme} tryAgain={tryAgain} t={key => key} />)
    fireEvent.press(getByTestId('button-tryAgain'))
    expect(tryAgain).toHaveBeenCalled()
  })
})
