import { NavigationContainer } from '@react-navigation/native'
import { fireEvent, waitFor } from '@testing-library/react-native'
import { TFunction } from 'i18next'
import React from 'react'
import { ThemeProvider } from 'styled-components'

import {
  CATEGORIES_ROUTE,
  CategoriesRouteInformationType,
  OPEN_PAGE_SIGNAL_NAME,
  SEARCH_FINISHED_SIGNAL_NAME,
  SearchResult,
} from 'shared'
import { CategoriesMapModelBuilder, EventModelBuilder, PoiModelBuilder } from 'shared/api'

import buildConfig from '../../constants/buildConfig'
import { urlFromRouteInformation } from '../../navigation/url'
import render from '../../testing/render'
import sendTrackingSignal from '../../utils/sendTrackingSignal'
import SearchModal, { SearchModalProps } from '../SearchModal'

jest.mock('../../utils/sendTrackingSignal')
jest.mock('../../components/FeedbackContainer')
jest.mock('../../components/TimeStamp')
jest.mock('../../hooks/useResourceCache', () => () => ({}))
jest.mock('react-i18next')
jest.mock('react-native-webview', () => ({
  default: () => jest.fn(),
}))
jest.mock('react-native-inappbrowser-reborn', () => ({
  isAvailable: () => false,
}))

jest.mock('shared', () => ({
  ...jest.requireActual('shared'),
  useMiniSearch: (results: SearchResult[]) => ({
    search: (query: string) => (query === 'no results, please' ? [] : results),
  }),
}))

describe('SearchModal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  const dummy = jest.fn()

  const t = ((key: string) => key) as TFunction

  const languageCode = 'de'
  const cityCode = 'augsburg'
  const theme = buildConfig().lightTheme

  const categoriesMapModel = new CategoriesMapModelBuilder(cityCode, languageCode, 2, 2).build()
  const categories = categoriesMapModel
    .toArray()
    .filter(category => !category.isRoot())
    .map(category => ({
      title: category.title,
      content: category.content,
      path: category.path,
      id: category.path,
      thumbnail: category.thumbnail,
    }))

  const eventModels = new EventModelBuilder('testseed', 5, cityCode, languageCode).build()
  const events = eventModels.map(event => ({
    title: event.title,
    content: event.content,
    path: event.path,
    id: event.path,
  }))

  const poiModels = new PoiModelBuilder(3).build()
  const pois = poiModels.map(poi => ({
    title: poi.title,
    content: poi.content,
    path: poi.path,
    id: poi.path,
    thumbnail: poi.thumbnail,
  }))

  const allPossibleResults: SearchResult[] = [...categories, ...events, ...pois]

  const props: SearchModalProps = {
    allPossibleResults,
    languageCode,
    cityCode,
    closeModal: dummy,
    t,
    theme,
    initialSearchText: '',
    loading: false,
  }

  const renderWithTheme = (props: SearchModalProps) =>
    render(
      <NavigationContainer>
        <ThemeProvider theme={theme}>
          <SearchModal {...props} />
        </ThemeProvider>
      </NavigationContainer>,
    )

  it('should send tracking signal when closing search site', async () => {
    const { getByPlaceholderText, getAllByRole } = renderWithTheme(props)
    const goBackButton = getAllByRole('button')[0]!
    const searchBar = getByPlaceholderText('searchPlaceholder')
    fireEvent.changeText(searchBar, 'Category')
    fireEvent.press(goBackButton)
    await waitFor(() => expect(goBackButton).not.toBeDisabled())
    await waitFor(() => expect(sendTrackingSignal).toHaveBeenCalledTimes(1))
    expect(sendTrackingSignal).toHaveBeenCalledWith({
      signal: {
        name: SEARCH_FINISHED_SIGNAL_NAME,
        query: 'Category',
        url: null,
      },
    })
  })

  it('should send tracking signal when opening a search result', async () => {
    const { getByText, getByPlaceholderText, getAllByRole } = renderWithTheme(props)
    const goBackButton = getAllByRole('button')[0]!
    const searchBar = getByPlaceholderText('searchPlaceholder')
    fireEvent.changeText(searchBar, 'Category')
    const categoryListItem = getByText('with id 1', { exact: false })
    fireEvent.press(categoryListItem)
    await waitFor(() => expect(goBackButton).not.toBeDisabled())
    expect(sendTrackingSignal).toHaveBeenCalledTimes(2)
    const routeInformation: CategoriesRouteInformationType = {
      route: CATEGORIES_ROUTE,
      cityContentPath: categoriesMapModel.toArray()[2]!.path,
      cityCode,
      languageCode,
    }
    const expectedUrl = urlFromRouteInformation(routeInformation)
    expect(sendTrackingSignal).toHaveBeenCalledWith({
      signal: {
        name: SEARCH_FINISHED_SIGNAL_NAME,
        query: 'Category',
        url: expectedUrl,
      },
    })
    expect(sendTrackingSignal).toHaveBeenCalledWith({
      signal: {
        name: OPEN_PAGE_SIGNAL_NAME,
        pageType: 'categories',
        url: expectedUrl,
      },
    })
  })

  it('should show nothing found if there are no search results', () => {
    const { getByText, getByPlaceholderText } = renderWithTheme(props)

    fireEvent.changeText(getByPlaceholderText('searchPlaceholder'), 'no results, please')

    expect(getByText('search:nothingFound')).toBeTruthy()
  })

  it('should open with an initial search text if one is supplied', () => {
    const initialSearchText = 'zeugnis'
    const { getByPlaceholderText } = renderWithTheme({ ...props, initialSearchText })
    expect(getByPlaceholderText('searchPlaceholder').props.value).toBe(initialSearchText)
  })
})
