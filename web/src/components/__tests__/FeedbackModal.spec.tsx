import { fireEvent } from '@testing-library/react'
import React, { ReactElement } from 'react'

import { CATEGORIES_ROUTE } from 'api-client'

import { renderWithRouterAndTheme } from '../../testing/render'
import FeedbackModal from '../FeedbackModal'

jest.mock('react-i18next')
jest.mock('api-client', () => ({
  ...jest.requireActual('api-client'),
  createFeedbackEndpoint: () => ({
    request: () => undefined,
  }),
}))
jest.mock('focus-trap-react', () => ({ children }: { children: ReactElement }) => <div>{children}</div>)

describe('FeedbackModal', () => {
  const cityCode = 'augsburg'
  const language = 'de'
  const closeModal = jest.fn()

  it('should display thanks message after successfully submitting feedback', async () => {
    const { getByRole, findByText } = renderWithRouterAndTheme(
      <FeedbackModal
        cityCode={cityCode}
        language={language}
        routeType={CATEGORIES_ROUTE}
        closeModal={closeModal}
        visible
      />
    )
    const buttonRating = getByRole('button', {
      name: 'feedback:useful',
    })
    fireEvent.click(buttonRating)
    const button = getByRole('button', {
      name: 'feedback:send',
    })
    fireEvent.click(button)

    expect(await findByText('feedback:thanksMessage')).toBeTruthy()
  })
})
