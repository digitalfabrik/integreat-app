import { render } from '@testing-library/react'
import React from 'react'
import { ThemeProvider } from 'styled-components'

import buildConfig from '../../constants/buildConfig'
import FeedbackToolbarItem from '../FeedbackToolbarItem'

jest.mock('react-i18next')

describe('FeedbackToolbarItem', () => {
  it('should render a positive FeedbackToolbarItem', () => {
    const { getByTitle } = render(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <FeedbackToolbarItem openFeedbackModal={() => undefined} isPositiveRatingLink viewportSmall />
      </ThemeProvider>
    )
    expect(getByTitle('faSmile')).toBeDefined()
  })

  it('should render a negative FeedbackToolbarItem', () => {
    const { getByTitle } = render(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <FeedbackToolbarItem openFeedbackModal={() => undefined} isPositiveRatingLink={false} viewportSmall />
      </ThemeProvider>
    )
    expect(getByTitle('faFrown')).toBeDefined()
  })
})
