import { DateTime } from 'luxon'
import React from 'react'

import { getExcerpt } from 'shared'
import { NewsModel } from 'shared/api'

import { EXCERPT_MAX_CHARS } from '../../constants'
import { renderWithRouterAndTheme } from '../../testing/render'
import NewsListItem from '../NewsListItem'

jest.mock('react-i18next')
jest.mock('../LastUpdateInfo', () =>
  jest.fn(({ lastUpdate, withText }: { lastUpdate: DateTime; withText: boolean }) => (
    <div>
      {withText ? 'lastUpdate ' : ''}
      {lastUpdate.toISO()}
    </div>
  )),
)

describe('NewsListItem', () => {
  const lastUpdate = DateTime.fromISO('2020-03-20T17:50:00.000Z')
  const news = new NewsModel({
    id: 217,
    title: 'Tick bite - What to do?',
    lastUpdate,
    content:
      'In summer there are often ticks in forest and meadows with high grass. These are very small animals. They feed on the blood of people or animals they sting, like mosquitoes. But they stay in the skin longer and can transmit dangerous diseases. If you have been in high grass, you should search your body very thoroughly for ticks. They like to sit in the knees, armpits or in the groin area. If you discover a tick in your skin, you should carefully pull it out with tweezers without crushing it. If the sting inflames, you must see a doctor.',
    availableLanguages: { de: 123, it: 234 },
    externalUrl: 'https://example.com',
    source: 'local',
  })

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

    const { getByText } = renderWithRouterAndTheme(<NewsListItem news={news} languageCode='de' regionCode='augsburg' />)

    expect(getByText(title)).toBeTruthy()
    expect(getByText(getExcerpt(message, { maxChars: EXCERPT_MAX_CHARS, replaceLineBreaks: false }))).toBeTruthy()
    expect(getByText(lastUpdate.toISO())).toBeTruthy()
    expect(() => getByText('lastUpdate')).toThrow()
  })
})
