import moment from 'moment'
import React from 'react'
import { ThemeProvider } from 'styled-components'

import { DateFormatter, LOCAL_NEWS_TYPE } from 'api-client'

import textTruncator from '../../../../api-client/src/utils/textTruncator'
import buildConfig from '../../constants/buildConfig'
import { renderWithRouter } from '../../testing/render'
import NewsListItem, { NUM_OF_CHARS_ALLOWED } from '../NewsListItem'

jest.mock('../LastUpdateInfo', () =>
  jest.fn(({ lastUpdate, withText }) => (
    <div>
      {withText ? 'lastUpdate ' : ''}
      {lastUpdate.toISOString()}
    </div>
  ))
)

describe('NewsListItem', () => {
  const theme = buildConfig().lightTheme
  const language = 'en'
  const link = '/testumgebung/en/news/local'
  const t = (key: string) => key

  const lastUpdate = moment('2020-03-20T17:50:00.000Z')
  const title = 'Tick bite - What to do?'

  it('should show all the relevant information', () => {
    const message =
      'In summer there are often ticks in forest and meadows with high grass. These are very small animals. ' +
      'They feed on the blood of people or animals they sting, like mosquitoes. ' +
      'But they stay in the skin longer and can transmit dangerous diseases. ' +
      'If you have been in high grass, you should search your body very thoroughly for ticks. ' +
      'They like to sit in the knees, armpits or in the groin area. ' +
      'If you discover a tick in your skin, you should carefully pull it out with tweezers without crushing it. ' +
      'If the sting inflames, you must see a doctor.'

    const { getByText } = renderWithRouter(
      <ThemeProvider theme={theme}>
        <NewsListItem
          type={LOCAL_NEWS_TYPE}
          title={title}
          content={message}
          timestamp={lastUpdate}
          formatter={new DateFormatter(language)}
          t={t}
          link={link}
        />
      </ThemeProvider>
    )

    expect(getByText(title)).toBeTruthy()
    expect(getByText(textTruncator(message, NUM_OF_CHARS_ALLOWED))).toBeTruthy()
    expect(getByText(lastUpdate.toISOString())).toBeTruthy()
    expect(() => getByText('lastUpdate')).toThrow()
  })
})
