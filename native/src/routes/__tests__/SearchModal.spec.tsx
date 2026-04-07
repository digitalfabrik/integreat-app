import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { CategoriesMapModelBuilder, EventModelBuilder, ExtendedPageModel, PoiModelBuilder } from 'shared/api'

import render from '../../testing/render'
import SearchModal, { SearchModalProps } from '../SearchModal'

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
