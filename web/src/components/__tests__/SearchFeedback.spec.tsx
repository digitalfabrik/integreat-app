import { fireEvent } from '@testing-library/react'
import React from 'react'

import { renderWithTheme } from '../../testing/render'
import SearchFeedback from '../SearchFeedback'

jest.mock('react-inlinesvg')
jest.mock('react-i18next')

describe('FeedbackSearch', () => {
  const cityCode = 'augsburg'
  const languageCode = 'de'

  it('should open FeedbackSection on button click', () => {
    const { queryByText, getByRole } = renderWithTheme(
      <SearchFeedback cityCode={cityCode} languageCode={languageCode} query='ab' resultsFound />,
    )
    const button = getByRole('button', { name: 'feedback:informationNotFound' })
    expect(queryByText('feedback:wantedInformation')).toBeNull()
    fireEvent.click(button)
    expect(queryByText('feedback:wantedInformation')).toBeTruthy()
  })
})
