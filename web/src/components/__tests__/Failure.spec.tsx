import React from 'react'

import { renderWithRouter } from '../../testing/render'
import Failure from '../Failure'

describe('Failure', () => {
  const mockTranslate = (key: string) => key

  it('should render a simple failure and match snapshot', () => {
    const errorMessage = 'error message'
    const { getByText } = renderWithRouter(<Failure errorMessage={errorMessage} goToPath='/' t={mockTranslate} />)

    const link = getByText('goTo.start')
    expect(link.closest('a')).toHaveAttribute('href', '/')
    expect(getByText(errorMessage)).toBeTruthy()
  })

  it('should render a failure with goToPath and goToMessage and match snapshot', () => {
    const error = {
      errorMessage: 'error message',
      goToPath: '/goTo.offers',
      goToMessage: 'goTo.offers',
    }
    const { getByText } = renderWithRouter(<Failure {...error} t={mockTranslate} />)

    const link = getByText(error.goToMessage)
    expect(link.closest('a')).toHaveAttribute('href', error.goToPath)
    expect(getByText(error.errorMessage)).toBeTruthy()
  })
})
