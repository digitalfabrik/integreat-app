import moment from 'moment'
import React from 'react'

import { DateFormatter, LOCAL_NEWS_TYPE, LocalNewsModel } from 'api-client'

import { renderWithBrowserRouter } from '../../testing/render'
import LocalNewsList from '../LocalNewsList'
import NewsListItem from '../NewsListItem'

describe('LocalNewsList', () => {
  const language = 'en'
  const link = '/testumgebung/en/news/local'
  const t = (key: string) => key
  const city = 'testcity'

  const renderItem = ({ id, title, message, timestamp }: LocalNewsModel) => (
    <NewsListItem
      title={title}
      content={message}
      timestamp={timestamp}
      type={LOCAL_NEWS_TYPE}
      key={id}
      link={link}
      t={t}
      formatter={new DateFormatter(language)}
    />
  )
  const date = moment('2017-11-18T09:30:00.000Z')
  const localNews1 = new LocalNewsModel({
    id: 217,
    title: 'Important',
    timestamp: date,
    message: 'This is a very important message from your favourite city!'
  })

  const localNews2 = new LocalNewsModel({
    id: 218,
    title: 'Love :)',
    timestamp: date,
    message: 'I am a random local news content content and I like it!!!!!!!!!'
  })

  const items = [localNews1, localNews2]

  it('should have two NewsListItem', () => {
    const { getByText } = renderWithBrowserRouter(
      <LocalNewsList items={items} renderItem={renderItem} city={city} noItemsMessage='no item' />,
      { wrapWithTheme: true }
    )
    expect(getByText('Love :)')).toBeDefined()
    expect(getByText('Important')).toBeDefined()
  })

  it('should render "noItemsMessage" if the items is an empty array', () => {
    const { getByText } = renderWithBrowserRouter(
      <LocalNewsList items={[]} renderItem={renderItem} city={city} noItemsMessage='No items' />,
      { wrapWithTheme: true }
    )
    expect(getByText('No items')).toBeDefined()
  })
})
