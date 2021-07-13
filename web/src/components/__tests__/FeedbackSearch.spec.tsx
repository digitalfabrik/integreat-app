import React from 'react'
import FeedbackSearch from '../FeedbackSearch'
import { fireEvent, render } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import buildConfig from '../../constants/buildConfig'

jest.mock('react-i18next')

describe('FeedbackSearch', () => {
  const cityCode = 'augsburg'
  const languageCode = 'de'

  it('should open FeedbackSection on button click', () => {
    const { queryByText, getByRole } = render(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <FeedbackSearch cityCode={cityCode} languageCode={languageCode} query={'ab'} resultsFound />
      </ThemeProvider>
    )
    const button = getByRole('button', { name: 'feedback:informationNotFound' })
    expect(queryByText('feedback:wantedInformation')).toBeNull()
    fireEvent.click(button)
    expect(queryByText('feedback:wantedInformation')).toBeTruthy()
  })
})
