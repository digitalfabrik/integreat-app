import { shallow } from 'enzyme'
import moment from 'moment'
import React from 'react'

import { DateFormatter, TU_NEWS_TYPE, TunewsModel } from 'api-client'

import NewsListItem from '../NewsListItem'
import TuNewsList from '../TuNewsList'

describe('TuNewsList', () => {
  const language = 'en'
  const link = '/testumgebung/en/news/local'
  const t = (key: string) => key
  const city = 'testcity'

  const renderItem = (language: string) => ({ id, title, content, date }: TunewsModel) => (
    <NewsListItem
      title={title}
      content={content}
      timestamp={date}
      type={TU_NEWS_TYPE}
      key={id}
      link={link}
      t={t}
      formatter={new DateFormatter(language)}
    />
  )
  const date1 = moment('2018-07-24T00:00:00.000Z')
  const date2 = moment('2018-07-24T00:00:00.000Z')

  const tunews = [
    new TunewsModel({
      id: 1,
      title: 'Tick bite - What to do?',
      tags: ['8 Gesundheit'],
      date: date1,
      content: `In summer there are often ticks in forest and meadows with high grass.
      These are very small animals. They feed on the blood of people or animals they sting, like mosquitoes.
      But they stay in the skin longer and can transmit dangerous diseases.
      If you have been in high grass, you should search your body very thoroughly for ticks. T
      hey like to sit in the knees, armpits or in the groin area.
      If you discover a tick in your skin, you should carefully pull it out with tweezers without crushing it.
      If the sting inflames, you must see a doctor. tünews INTERNATIONAL`,
      eNewsNo: 'tun0000009902'
    }),
    new TunewsModel({
      id: 2,
      title: 'Volunteering',
      tags: ['1 Society'],
      date: date2,
      content: 'Volunteering in Germany (and in other countries) is a very good thing!',
      eNewsNo: 'tun0000009902'
    })
  ]

  it('should have two NewsListItem', () => {
    const tunewsList = shallow(
      <TuNewsList
        language={language}
        items={tunews}
        renderItem={renderItem(language)}
        city={city}
        fetchMoreTunews={() => {}}
        hasMore
        isFetching={false}
        noItemsMessage={t('currentlyNoTunews')}
      />
    ).dive()

    const newsElementList = tunewsList.find(NewsListItem)

    expect(newsElementList).toHaveLength(2)
    expect(newsElementList.find({ title: 'Tick bite - What to do?' })).toHaveLength(1)
  })

  it('should render "currentlyNoTunews" if the items is an empty array and hasMore is false', () => {
    const tunewsList = shallow(
      <TuNewsList
        language={language}
        items={[]}
        renderItem={renderItem(language)}
        city={city}
        fetchMoreTunews={() => {}}
        hasMore={false}
        isFetching={false}
        noItemsMessage={t('currentlyNoTunews')}
      />
    ).dive()

    const noItemsMessage = tunewsList.text()
    expect(noItemsMessage).toEqual('currentlyNoTunews')
  })
})
