import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { CategoriesMapModelBuilder, EventModelBuilder, ExtendedDocumentModel, PoiModelBuilder } from 'shared/api'

import createNavigationMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import Search, { SearchProps } from '../Search'

jest.mock('../../utils/openExternalUrl', () => async () => undefined)
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
  const cityCode = 'augsburg'

  const categoriesMapModel = new CategoriesMapModelBuilder(cityCode, languageCode, 2, 2).build()
  const eventModels = new EventModelBuilder('testseed', 5, cityCode, languageCode).build()
  const poiModels = new PoiModelBuilder(3).build()

  const documents = [
    ...categoriesMapModel.toArray().filter(category => !category.isRoot()),
    ...eventModels,
    ...poiModels,
  ]

  const props: SearchProps = {
    userLanguageDocuments: documents,
    sourceLanguageDocuments: [],
    languageCode,
    cityCode,
    navigation: createNavigationMock(),
    initialSearchText: '',
  }

  const renderSearch = (props: SearchProps) => render(<Search {...props} />)

  it('should show nothing found if there are no search results', () => {
    const { getByText, getByPlaceholderText } = renderSearch(props)

    fireEvent.changeText(getByPlaceholderText('searchPlaceholder'), 'no results, please')

    expect(getByText('noResultsInUserLanguage')).toBeTruthy()
  })

  it('should open with an initial search text if one is supplied', () => {
    const initialSearchText = 'zeugnis'
    const { getByPlaceholderText } = renderSearch({ ...props, initialSearchText })
    expect(getByPlaceholderText('searchPlaceholder').props.value).toBe(initialSearchText)
  })
})
