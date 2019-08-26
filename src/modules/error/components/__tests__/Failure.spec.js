// @flow
import FailureWithHOCs, { Failure } from '../Failure'
import { render, fireEvent } from 'react-native-testing-library'
import * as React from 'react'
import { Text } from 'react-native'
import { brightTheme } from '../../../theme/constants/theme'
import { I18nextProvider } from 'react-i18next'
import I18nProvider from '../../../i18n/components/I18nProvider'

describe('Failure', () => {
  it('should render a retry button if tryAgain is passed', () => {
    const { getByTestId } = render(<Failure theme={brightTheme} error={new Error()} tryAgain={() => {}}
                                            t={key => key} />)

    expect(getByTestId('button-tryAgain')).not.toBeNull()
  })

  it('should not render a retry button if tryAgain is not passed', () => {
    const { queryByTestId } = render(<Failure theme={brightTheme} error={new Error()}
                                              t={key => key} />)

    expect(queryByTestId('button-tryAgain')).toBeNull()
  })

  it('should have a correct message as title', () => {
    const { getByText } = render(<Failure theme={brightTheme} error={new Error('error-message')}
                                          t={key => key} />)

    expect(getByText('error-message')).toBeTruthy()
  })

  it('should have a general title if there is no error instance', () => {
    const { getByText } = render(<Failure theme={brightTheme} t={key => key} />)

    expect(getByText('generalError')).toBeTruthy()
  })

  it('should try again if button is pressed', () => {
    const tryAgain = jest.fn()
    const { getByTestId } = render(<Failure theme={brightTheme} error={new Error()} tryAgain={tryAgain}
                                            t={key => key} />)

    fireEvent.press(getByTestId('button-tryAgain'))
    expect(tryAgain).toHaveBeenCalled()
  })

  describe('withTheme()(translate())', () => {

    it('should pass props', () => {
      const result = render(<I18nProvider setContentLanguage={() => {}}><FailureWithHOCs testID={'test'}/></I18nProvider>)

      //console.dir(getByTestId('test'))

      //getByTestId('test')

      //getByTestId('test').toHaveAttribute('disabled')

      console.log(JSON.stringify(result))
      //result.debug.shallow()
    })
  })
})
