import { fireEvent } from '@testing-library/react'
import React from 'react'

import { renderWithTheme } from '../../testing/render'
import FeedbackSearch from '../FeedbackSearch'

jest.mock('react-i18next')

describe('FeedbackSearch', () => {
  const cityCode = 'augsburg'
  const languageCode = 'de'

  it('should open FeedbackSection on button click', () => {
    const { queryByText, getByRole } = renderWithTheme(
      <FeedbackSearch cityCode={cityCode} languageCode={languageCode} query='ab' resultsFound />
    )
    const button = getByRole('button', { name: 'feedback:informationNotFound' })
    expect(queryByText('feedback:wantedInformation')).toBeNull()
    fireEvent.click(button)
    expect(queryByText('feedback:wantedInformation')).toBeTruthy()
  })
})
