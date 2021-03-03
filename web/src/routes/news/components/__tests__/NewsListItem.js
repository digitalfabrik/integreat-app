// @flow

import React, { type Node } from 'react'
import { LocalNewsModel } from 'api-client'
import moment from 'moment'
import NewsListItem, { NUM_OF_WORDS_ALLOWED } from '../NewsListItem'
import { LOCAL_NEWS } from '../../constants'
import textTruncator from '../../../../modules/common/utils/textTruncator'
import DateFormatter from 'api-client/src/i18n/DateFormatter'
import { render } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import theme from '../../../../modules/theme/constants/theme'

jest.mock('redux-first-router-link', () =>
  ({ children }: { children: Array<Node>, ...}) => <div>{children}</div>
)
jest.mock('../../../../modules/common/components/LastUpdateInfo', () =>
  jest.fn(({ lastUpdate, withText }) => <div>{withText ? 'lastUpdate ' : ''}{lastUpdate.toISOString()}</div>)
)

describe('NewsListItem', () => {
  const language = 'en'
  const link = '/testumgebung/en/news/local'
  const t = (key: ?string): string => key || ''

  const date = moment('2020-03-20T17:50:00.000Z')
  const newsItem = new LocalNewsModel({
    id: 217,
    title: 'Tick bite - What to do?',
    timestamp: date,
    message:
      'In summer there are often ticks in forest and meadows with high grass. These are very small animals. ' +
      'They feed on the blood of people or animals they sting, like mosquitoes. ' +
      'But they stay in the skin longer and can transmit dangerous diseases. ' +
      'If you have been in high grass, you should search your body very thoroughly for ticks. ' +
      'They like to sit in the knees, armpits or in the groin area. ' +
      'If you discover a tick in your skin, you should carefully pull it out with tweezers without crushing it. ' +
      'If the sting inflames, you must see a doctor.'
  })

  const { title, message, timestamp } = newsItem

  it('should show all the relevant information', () => {
    const { getByText } = render(
      <ThemeProvider theme={theme}>
        <NewsListItem
          type={LOCAL_NEWS}
          title={title}
          content={message}
          timestamp={timestamp}
          formatter={new DateFormatter(language)}
          t={t}
          link={link} />
      </ThemeProvider>
    )

    expect(getByText(newsItem.title)).toBeTruthy()
    expect(getByText(textTruncator(newsItem.message, NUM_OF_WORDS_ALLOWED))).toBeTruthy()
    expect(getByText(timestamp.toISOString())).toBeTruthy()
    expect(() => getByText('lastUpdate')).toThrow()
  })
})
