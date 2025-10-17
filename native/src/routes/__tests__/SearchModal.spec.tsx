import { fireEvent, waitFor } from '@testing-library/react-native'
import React from 'react'

import {
  CATEGORIES_ROUTE,
  CategoriesRouteInformationType,
  OPEN_PAGE_SIGNAL_NAME,
  SEARCH_FINISHED_SIGNAL_NAME,
} from 'shared'
import { CategoriesMapModelBuilder, EventModelBuilder, ExtendedPageModel, PoiModelBuilder } from 'shared/api'

import { urlFromRouteInformation } from '../../navigation/url'
import render from '../../testing/render'
import sendTrackingSignal from '../../utils/sendTrackingSignal'
import SearchModal, { SearchModalProps } from '../SearchModal'

jest.mock('../../utils/sendTrackingSignal')
jest.mock('react-i18next')
jest.mock('react-native-inappbrowser-reborn', () => ({
  isAvailable: () => false,
}))

jest.mock('shared/hooks/useDebounce', () => ({
  __esModule: true,
  default: (value: string) => value,
}))

jest.mock('shared', () => ({
  ...jest.requireActual('shared'),
  useSearch: (documents: ExtendedPageModel[], query: string) => ({
    data: query === 'no results, please' ? [] : documents,
    error: null,
    loading: false,
  }),
}))

describe('SearchModal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  const dummy = jest.fn()

  const languageCode = 'de'
  const cityCode = 'augsburg'

  const categoriesMapModel = new CategoriesMapModelBuilder(cityCode, languageCode, 2, 2).build()
  const eventModels = new EventModelBuilder('testseed', 5, cityCode, languageCode).build()
  const poiModels = new PoiModelBuilder(3).build()

  const documents = [
    ...categoriesMapModel.toArray().filter(category => !category.isRoot()),
    ...eventModels,
    ...poiModels,
  ]

  const props: SearchModalProps = {
    documents,
    fallbackLanguageDocuments: [],
    languageCode,
    cityCode,
    closeModal: dummy,
    initialSearchText: '',
  }

  const renderSearchModal = (props: SearchModalProps) => render(<SearchModal {...props} />)

  it('should send tracking signal when closing search site', async () => {
    const { getByPlaceholderText, getAllByRole } = renderSearchModal(props)
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
    const { getByText, getByPlaceholderText, getAllByRole } = renderSearchModal(props)
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
    const { getByText, getByPlaceholderText } = renderSearchModal(props)

    fireEvent.changeText(getByPlaceholderText('searchPlaceholder'), 'no results, please')

    expect(getByText('noResultsInUserLanguage')).toBeTruthy()
  })

  it('should open with an initial search text if one is supplied', () => {
    const initialSearchText = 'zeugnis'
    const { getByPlaceholderText } = renderSearchModal({ ...props, initialSearchText })
    expect(getByPlaceholderText('searchPlaceholder').props.value).toBe(initialSearchText)
  })
})
