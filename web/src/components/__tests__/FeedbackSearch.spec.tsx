import React from 'react'
import FeedbackSearch from '../FeedbackSearch'
import { shallow } from 'enzyme'
import { fireEvent, render } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import buildConfig from '../../constants/buildConfig'

jest.mock('react-i18next')

describe('SearchFeedback', () => {
  const cityCode = 'augsburg'
  const languageCode = 'de'

  it('should render a NothingFoundFeedbackBox if no results are found', () => {
    expect(
      shallow(<FeedbackSearch cityCode={cityCode} languageCode={languageCode} query='abc' resultsFound={false} />)
    ).toMatchSnapshot()
  })

  it('should render a FeedbackButton if results are found and the query is not empty', () => {
    expect(
      shallow(<FeedbackSearch cityCode={cityCode} languageCode={languageCode} query='ab' resultsFound />)
    ).toMatchSnapshot()
  })

  it('should render neither a NothingFoundFeedbackBox nor a FeedbackButton', () => {
    expect(
      shallow(<FeedbackSearch cityCode={cityCode} languageCode={languageCode} query='' resultsFound />)
    ).toMatchSnapshot()
  })

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
