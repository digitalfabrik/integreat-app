import { fireEvent } from '@testing-library/react-native'
import { DateTime } from 'luxon'
import React from 'react'

import { NEWS_ALL_SOURCES_FILTER, replaceLinks } from 'shared'
import { LanguageModelBuilder, NewsModel, RegionModel } from 'shared/api'

import useNavigate from '../../hooks/useNavigate'
import createNavigationPropMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import News from '../News'

import mocked = jest.mocked

jest.mock('react-i18next')
jest.mock('../../components/Page')
jest.mock('../../hooks/useNavigate')
jest.mock('../../utils/openExternalUrl')

const defaultNews: [NewsModel, NewsModel] = [
  new NewsModel({
    id: 1,
    title: 'Tick bite - What to do?',
    lastUpdate: DateTime.fromISO('2020-01-20T00:00:00.000Z'),
    content:
      'In summer there are often ticks in forest and meadows with high grass. These are very small animals. They feed on the blood of people or animals they sting, like mosquitoes. But they stay in the skin longer and can transmit dangerous diseases. If you have been in high grass, you should search your body very thoroughly for ticks. They like to sit in the knees, armpits or in the groin area. If you discover a tick in your skin, you should carefully pull it out with tweezers without crushing it. If the sting inflames, you must see a doctor. https://example.com',
    availableLanguages: { de: 1234 },
    externalUrl: 'https://example.com',
    source: 'tunews',
  }),
  new NewsModel({
    id: 2,
    title: 'Test Local',
    lastUpdate: DateTime.fromISO('2020-01-21T00:00:00.000Z'),
    content: 'Test local news content. https://example.com',
    availableLanguages: { de: 123 },
    externalUrl: 'https://example.com',
    source: 'local',
  }),
]

describe('News', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const navigation = createNavigationPropMock()
  const navigateTo = jest.fn()
  mocked(useNavigate).mockImplementation(() => ({ navigateTo, navigation }))
  const language = 'de'

  const renderNews = ({
    id = null,
    news = defaultNews,
    tuNewsEnabled = true,
    localNewsEnabled = true,
  }: {
    id?: number | null
    news?: NewsModel[]
    tuNewsEnabled?: boolean
    localNewsEnabled?: boolean
  }) => {
    const regionModel = new RegionModel({
      name: 'Oldtown',
      code: 'oldtown',
      live: false,
      languages: new LanguageModelBuilder(2).build(),
      eventsEnabled: true,
      placesEnabled: false,
      localNewsEnabled,
      tuNewsEnabled,
      sortingName: 'Oldtown',
      prefix: 'GoT',
      latitude: 48.369696,
      longitude: 10.892578,
      aliases: null,
      boundingBox: [10.7880103, 48.447238, 11.0174493, 48.297834],
      chatEnabled: false,
      chatPrivacyPolicyUrl: null,
    })
    const setNewsSource = jest.fn()
    const props = { regionModel, language }
    return render(
      <News
        {...props}
        news={news}
        id={id}
        languageCode='de'
        regionCode='augsburg'
        refresh={jest.fn}
        newsSource={NEWS_ALL_SOURCES_FILTER}
        setNewsSource={setNewsSource}
      />,
    )
  }

  it('should show not found error if news with id not found', () => {
    const { getByText } = renderNews({ id: 32498732984824 })
    expect(getByText('pageNotFound')).toBeTruthy()
  })

  it('should show news detail', () => {
    const { queryByText } = renderNews({ id: defaultNews[0].id })
    expect(queryByText(defaultNews[0].title)).toBeTruthy()
    expect(queryByText(defaultNews[0].content)).toBeTruthy()

    expect(queryByText(defaultNews[1].title)).toBeFalsy()
  })

  it('should show news list', () => {
    const { getByText } = renderNews({})
    expect(getByText(defaultNews[0].title)).toBeTruthy()
    expect(getByText(defaultNews[0].content)).toBeTruthy()

    expect(getByText(defaultNews[1].title)).toBeTruthy()
    expect(getByText(defaultNews[1].content)).toBeTruthy()

    fireEvent.press(getByText(defaultNews[1].title))
    expect(navigateTo).toHaveBeenCalledWith({ id: 2, languageCode: 'de', regionCode: 'augsburg', route: 'news' })
  })

  it('should show currently no news', () => {
    const { queryByText } = renderNews({ news: [] })
    expect(queryByText('currentlyNoNews')).toBeTruthy()

    expect(queryByText(defaultNews[0].title)).toBeFalsy()
    expect(queryByText(defaultNews[1].title)).toBeFalsy()
  })

  it('should not add links in list', () => {
    const { getByText } = renderNews({ news: defaultNews })
    expect(getByText(defaultNews[0].title)).toBeTruthy()
    expect(getByText(defaultNews[0].content)).toBeTruthy()
  })

  it('should not add links for tünews', () => {
    const { getByText, queryByText } = renderNews({ news: defaultNews, id: defaultNews[0].id })
    expect(getByText(defaultNews[0].title)).toBeTruthy()
    expect(getByText(defaultNews[0].content)).toBeTruthy()
    expect(queryByText(replaceLinks(defaultNews[0].content))).toBeFalsy()
  })

  it('should add links in local news detail', () => {
    const { getByText, queryByText } = renderNews({ news: defaultNews, id: defaultNews[1].id })
    expect(getByText(defaultNews[1].title)).toBeTruthy()
    expect(queryByText(defaultNews[1].content)).toBeFalsy()
    expect(queryByText(replaceLinks(defaultNews[1].content))).toBeTruthy()
  })
})
