import React from 'react'
import { render } from '@testing-library/react'
import { Failure } from '../Failure'

describe('Failure', () => {
  const mockTranslate = key => key

  it('should render a simple failure and match snapshot', () => {
    const errorMessage = 'error message'
    const { getByText } = render(<Failure errorMessage={errorMessage} t={mockTranslate} />)

    const link = getByText(Failure.defaultProps.goToMessage)
    // @ts-ignore TODO IGAPP-658
    expect(link.closest('a')).toHaveAttribute('href', Failure.defaultProps.goToPath)
    expect(getByText(errorMessage)).toBeTruthy()
  })

  it('should render a failure with goToPath and goToMessage and match snapshot', () => {
    const error = {
      errorMessage: 'error message',
      goToPath: 'goTo.offers',
      goToMessage: 'goTo.offers'
    }
    const { getByText } = render(<Failure {...error} t={mockTranslate} />)

    const link = getByText(error.goToMessage)
    // @ts-ignore TODO IGAPP-658
    expect(link.closest('a')).toHaveAttribute('href', error.goToPath)
    expect(getByText(error.errorMessage)).toBeTruthy()
  })
})
