import { TFunction } from 'i18next'
import { DateTime } from 'luxon'
import React from 'react'

import { getExcerpt, LOCAL_NEWS_TYPE } from 'shared'

import { EXCERPT_MAX_CHARS } from '../../constants'
import { renderWithRouterAndTheme } from '../../testing/render'
import NewsListItem from '../NewsListItem'

jest.mock('../LastUpdateInfo', () =>
  jest.fn(({ lastUpdate, withText }: { lastUpdate: DateTime; withText: boolean }) => (
    <div>
      {withText ? 'lastUpdate ' : ''}
      {lastUpdate.toISO()}
    </div>
  )),
)

describe('NewsListItem', () => {
  const link = '/testumgebung/en/news/local'
  const t = ((key: string) => key) as TFunction

  const lastUpdate = DateTime.fromISO('2020-03-20T17:50:00.000Z')
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

    const { getByText } = renderWithRouterAndTheme(
      <NewsListItem type={LOCAL_NEWS_TYPE} title={title} content={message} timestamp={lastUpdate} t={t} link={link} />,
    )

    expect(getByText(title)).toBeTruthy()
    expect(getByText(getExcerpt(message, { maxChars: EXCERPT_MAX_CHARS, replaceLineBreaks: false }))).toBeTruthy()
    expect(getByText(lastUpdate.toISO())).toBeTruthy()
    expect(() => getByText('lastUpdate')).toThrow()
  })
})
