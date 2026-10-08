import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { CategoriesMapModelBuilder, EventModelBuilder, ExtendedDocumentModel, PlaceModelBuilder } from 'shared/api'

import createNavigationMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import Search, { SearchProps } from '../Search'

jest.mock('@react-native-community/netinfo', () => ({ useNetInfo: jest.fn(() => ({ isConnected: true })) }))
jest.mock('../../utils/openExternalUrl', () => async () => undefined)
jest.mock('react-native-inappbrowser-reborn', () => ({
  isAvailable: () => false,
}))

jest.mock('shared', () => ({
  ...jest.requireActual('shared'),
  useDebounce: (value: string) => value,
  useSearch: ({ userLanguageDocuments, query }: { userLanguageDocuments: ExtendedDocumentModel[]; query: string }) => ({
    data: query === 'no results, please' ? [] : userLanguageDocuments,
    error: null,
    loading: false,
  }),
}))

describe('Search', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const languageCode = 'de'
  const regionCode = 'augsburg'

  const categoriesMapModel = new CategoriesMapModelBuilder(regionCode, languageCode, 2, 2).build()
  const eventModels = new EventModelBuilder('testseed', 5, regionCode, languageCode).build()
  const placeModels = new PlaceModelBuilder(3).build()

  const documents = [
    ...categoriesMapModel.toArray().filter(category => !category.isRoot()),
    ...eventModels,
    ...placeModels,
  ]

  const props: SearchProps = {
    userLanguageDocuments: documents,
    sourceLanguageDocuments: [],
    languageCode,
    regionCode,
    navigation: createNavigationMock(),
    initialSearchText: '',
  }

  const renderSearch = (props: SearchProps) => render(<Search {...props} />)

  it('should show nothing found if there are no search results', () => {
    const { getByText, getByPlaceholderText } = renderSearch(props)

    fireEvent.changeText(getByPlaceholderText('search:searchContent'), 'no results, please')

    expect(getByText('feedback:search.noResultsInUserLanguage')).toBeTruthy()
  })

  it('should open with an initial search text if one is supplied', () => {
    const initialSearchText = 'zeugnis'
    const { getByPlaceholderText } = renderSearch({ ...props, initialSearchText })
    expect(getByPlaceholderText('search:searchContent').props.value).toBe(initialSearchText)
  })

  it('should show the search results for a query', () => {
    const { getByPlaceholderText, getByText } = renderSearch(props)

    fireEvent.changeText(getByPlaceholderText('search:searchContent'), 'zeugnis')

    expect(getByText(documents[0]!.title)).toBeTruthy()
  })

  it('should show feedback below the results if something was found but was unwanted', async () => {
    const { getByPlaceholderText, findByText } = renderSearch(props)

    fireEvent.changeText(getByPlaceholderText('search:searchContent'), 'zeugnis')

    expect(await findByText('feedback:search.informationNotFound')).toBeDefined()
  })

  it('should show feedback if nothing was found', () => {
    const { getByPlaceholderText, getByText } = renderSearch(props)

    fireEvent.changeText(getByPlaceholderText('search:searchContent'), 'no results, please')

    expect(getByText('feedback:search.noResultsInUserLanguage')).toBeTruthy()
    expect(getByText('feedback:search.informUs')).toBeTruthy()
  })
})
