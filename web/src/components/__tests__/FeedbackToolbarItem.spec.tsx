import { fireEvent } from '@testing-library/react'
import React from 'react'

import { CATEGORIES_ROUTE } from 'api-client/src'

import { renderWithTheme } from '../../testing/render'
import FeedbackToolbarItem from '../FeedbackToolbarItem'
import Layout, { LAYOUT_ELEMENT_ID } from '../Layout'

jest.mock('../FeedbackModal', () => ({ closeModal }: { closeModal: () => void }) => (
  <div onClick={closeModal}>FeedbackModal</div>
))
jest.mock('react-i18next')
jest.mock('../../hooks/useCityContentParams', () => () => ({ cityCode: 'augsburg', languageCode: 'de' }))

describe('FeedbackToolbarItem', () => {
  beforeEach(jest.clearAllMocks)

  const renderFeedbackToolbarItem = () =>
    renderWithTheme(
      <Layout>
        <FeedbackToolbarItem route={CATEGORIES_ROUTE} slug='my-slug' />
      </Layout>
    )

  it('should open and close feedback modal on click', () => {
    const { getByText, queryByText, container } = renderFeedbackToolbarItem()

    fireEvent.click(getByText('feedback:feedback'))

    expect(getByText('FeedbackModal')).toBeTruthy()
    expect(container.querySelector(`[id="${LAYOUT_ELEMENT_ID}"]`)?.getAttribute('aria-hidden')).toBe('true')

    fireEvent.click(getByText('FeedbackModal'))

    expect(queryByText('FeedbackModal')).toBeFalsy()
    expect(container.querySelector(`[id="${LAYOUT_ELEMENT_ID}"]`)?.getAttribute('aria-hidden')).toBe('false')
  })
})
