import { fireEvent, waitFor } from '@testing-library/react'
import React from 'react'

import { renderWithTheme } from '../../testing/render'
import SearchFeedback from '../SearchFeedback'
import ThemeContainer from '../ThemeContainer'

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: (namespace?: string) => ({
    t: (key: string) => (namespace ? `${namespace}:${key}` : key),
  }),
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey,
}))

describe('SearchFeedback', () => {
  it('should open FeedbackSection on button click', () => {
    const { getByText, getByLabelText, queryByText } = renderWithTheme(<SearchFeedback query='ab' noResults={false} />)
    expect(queryByText('feedback:wantedInformation')).toBeNull()

    fireEvent.click(getByText('feedback:informationNotFound'))

    expect(getByLabelText('feedback:wantedInformation')).toBeTruthy()
  })

  it('should stop showing feedback if query changes', () => {
    const { getByLabelText, getByText, queryByText, rerender } = renderWithTheme(
      <SearchFeedback query='ab' noResults={false} />,
    )
    expect(queryByText('feedback:wantedInformation')).toBeNull()
    fireEvent.click(getByText('feedback:informationNotFound'))
    expect(getByLabelText('feedback:wantedInformation')).toBeTruthy()

    rerender(
      <ThemeContainer contentDirection='ltr'>
        <SearchFeedback query='a' noResults={false} />
      </ThemeContainer>,
    )

    expect(queryByText('feedback:wantedInformation')).toBeNull()
  })

  it('should show feedback button if no results found', () => {
    const { getByText } = renderWithTheme(<SearchFeedback query='ab' noResults />)
    expect(getByText('feedback:giveFeedback')).toBeTruthy()
  })

  it('should not allow sending search feedback if query term is removed', async () => {
    const { getByText, rerender } = renderWithTheme(<SearchFeedback query='ab' noResults />)
    fireEvent.click(getByText('feedback:giveFeedback'))
    getByText('common:privacyPolicy').click()
    expect(getByText('feedback:send')).toBeEnabled()

    // the query is controlled in the parent of SearchFeedback, so we need to update the props
    rerender(
      <ThemeContainer contentDirection='ltr'>
        <SearchFeedback query='' noResults />
      </ThemeContainer>,
    )
    fireEvent.click(getByText('feedback:giveFeedback'))
    await waitFor(() => expect(getByText('feedback:send')).toBeInTheDocument())
  })
})
