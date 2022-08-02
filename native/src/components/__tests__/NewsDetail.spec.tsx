import { fireEvent, render } from '@testing-library/react-native'
import moment from 'moment'
import React from 'react'
import { ThemeProvider } from 'styled-components/native'

import { DateFormatter, LocalNewsModel, TunewsModel } from 'api-client'

import buildConfig from '../../constants/buildConfig'
import navigateToLink from '../../navigation/navigateToLink'
import NewsDetail from '../NewsDetail'

const mockNavigation = jest.fn()

jest.mock('react-i18next')
jest.mock('../../navigation/navigateToLink', () => jest.fn(Promise.resolve))
jest.mock('../../hooks/useSnackbar')
jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  default: jest.fn(() => ({ width: 1234 })),
}))
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}))
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigation,
}))
jest.mock('styled-components')

const testHTML = `<main><p>ArbeitnehmerInnen in Quarant&#228;ne haben nicht zwangsl&#228;ufig frei.</p>\n<p>tun21033101</p>\n
  <h1><a href='https://tunewsinternational.com/category/corona-deutsch/'>Aktuelle Informationen zu Corona: Hier klicken</a></h1>\n</main>\n`
const tuNews = new TunewsModel({
  id: 9902,
  title: 'Was ist ein Verein?',
  date: moment('2020-01-20T00:00:00.000Z'),
  tags: [],
  content: testHTML,
  eNewsNo: 'tun0000009902',
})
const localNews = new LocalNewsModel({
  id: 9902,
  timestamp: moment('2020-01-20T00:00:00.000Z'),
  title: 'Test Push Notification',
  message: 'Some test text mailto:app@integreat-app.de with lots of links https://integreat.app',
})

describe('NewsDetail', () => {
  const theme = buildConfig().lightTheme
  const language = 'de'

  const renderNewsDetail = (news: LocalNewsModel | TunewsModel) =>
    render(
      <ThemeProvider theme={theme}>
        <NewsDetail newsItem={news} language={language} />
      </ThemeProvider>
    )

  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('should correctly render a local news item', () => {
    const dateFormatter = new DateFormatter('de')
    const timestamp = dateFormatter.format(localNews.timestamp, {
      format: 'LLL',
    })
    const { getByText, queryByText } = renderNewsDetail(localNews)
    expect(getByText(localNews.title)).toBeTruthy()
    expect(getByText('Some test text')).toBeTruthy()
    expect(getByText('mailto:app@integreat-app.de')).toBeTruthy()
    expect(getByText('with lots of links')).toBeTruthy()
    expect(getByText('https://integreat.app')).toBeTruthy()
    expect(getByText(timestamp)).toBeTruthy()
    expect(queryByText('Last Update')).toBeNull()
    fireEvent.press(getByText('mailto:app@integreat-app.de'))
    expect(navigateToLink).toHaveBeenCalledWith(
      'mailto:app@integreat-app.de',
      mockNavigation,
      language,
      expect.anything(),
      'mailto:app@integreat-app.de'
    )
    fireEvent.press(getByText('https://integreat.app'))
    expect(navigateToLink).toHaveBeenCalledWith(
      'https://integreat.app/',
      mockNavigation,
      language,
      expect.anything(),
      'https://integreat.app/'
    )
  })

  it('should correctly render a tu news item', () => {
    const { getByText, queryByText } = renderNewsDetail(tuNews)
    expect(queryByText('<main>')).toBeFalsy()
    expect(getByText(tuNews.title)).toBeTruthy()
    expect(getByText('ArbeitnehmerInnen in Quarantäne haben nicht zwangsläufig frei.')).toBeTruthy()
    expect(getByText('Aktuelle Informationen zu Corona: Hier klicken')).toBeTruthy()
  })

  it('should correctly render a tu news item link', () => {
    const { getByText, queryByText } = renderNewsDetail(tuNews)
    expect(queryByText('https://tunewsinternational.com/category/corona-deutsch/')).toBeFalsy()
    fireEvent.press(getByText('Aktuelle Informationen zu Corona: Hier klicken'))
    expect(navigateToLink).toHaveBeenCalledWith(
      'https://tunewsinternational.com/category/corona-deutsch/',
      mockNavigation,
      language,
      expect.anything(),
      'https://tunewsinternational.com/category/corona-deutsch/'
    )
  })
})
