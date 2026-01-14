import { fireEvent } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import { NewsRouteType, parseHTML, SEARCH_FINISHED_SIGNAL_NAME } from 'shared'
import { CategoriesMapModelBuilder, CityModelBuilder, LanguageModelBuilder } from 'shared/api'

import useNavigate from '../../hooks/useNavigate'
import createNavigationScreenPropMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import sendTrackingSignal from '../../utils/sendTrackingSignal'
import { CategoryThumbnail } from '../CategoryListItem'
import SearchListItem from '../SearchListItem'

jest.mock('react-i18next')
jest.mock('styled-components')
jest.mock('../../utils/sendTrackingSignal')

jest.mock('../CategoryListItem', () => ({
  CategoryThumbnail: jest.fn(() => null),
}))
jest.mock('../../hooks/useNavigate')

describe('SearchListItem', () => {
  const cityModel = new CityModelBuilder(1).build()[0]!
  const language = new LanguageModelBuilder(1).build()[0]!
  const { categories: categoriesMapModel } = new CategoriesMapModelBuilder(cityModel.code, language.code).buildAll()
  const categories = categoriesMapModel.toArray()
  const category = categories[1]!
  const contentWithoutHtml = parseHTML(category.content)

  beforeEach(() => {
    jest.clearAllMocks()
  })
  const navigation = createNavigationScreenPropMock<NewsRouteType>()
  mocked(useNavigate).mockImplementation(() => ({ navigateTo: jest.fn(), navigation }))

  const assertHighlighting = (element: HTMLElement, highlighted: boolean) =>
    highlighted
      ? expect(element).toHaveStyle({ fontWeight: '600' })
      : expect(element).not.toHaveStyle({ fontWeight: '600' })

  const renderSearchListItem = (query: string, thumbnail: string | null = category.thumbnail) =>
    render(
      <SearchListItem
        contentWithoutHtml={contentWithoutHtml}
        query={query}
        language={language.code}
        title={category.title}
        path={category.path}
        thumbnail={thumbnail}
      />,
    )

  it('should show excerpt around query if match in title and content', () => {
    const query = 'Category'
    const excerptBeforeQuery = 'Page of'
    const excerptAfterQuery = '0 This is a sample page'

    const { queryAllByText, getByText } = renderSearchListItem(query)

    assertHighlighting(getByText(excerptBeforeQuery, { exact: false }), false)
    assertHighlighting(queryAllByText(query)[0]!, true)
    assertHighlighting(queryAllByText(query)[1]!, true)
    assertHighlighting(getByText(excerptAfterQuery, { exact: false }), false)
  })

  it('should show beginning of excerpt if match only in title', () => {
    const { getByText } = renderSearchListItem(category.title)

    assertHighlighting(getByText(category.title), true)
    assertHighlighting(getByText(contentWithoutHtml), false)
  })

  it('should show excerpt around query if only match in content', () => {
    const excerptBeforeQuery = 'This is a'
    const query = 'sample'
    const excerptAfterQuery = 'page'

    const { getByText } = renderSearchListItem(query)

    assertHighlighting(getByText(excerptBeforeQuery, { exact: false }), false)
    assertHighlighting(getByText(query), true)
    assertHighlighting(getByText(excerptAfterQuery, { exact: false }), false)
  })

  it('should show title if the query is empty', () => {
    const query = ''

    const { getByText } = renderSearchListItem(query)

    expect(getByText(category.title)).toBeTruthy()
    expect(getByText(category.title)).toHaveStyle({ fontWeight: 'bold' })
  })

  it('should send tracking signal when pressed', () => {
    const query = 'test'
    const { getByRole } = renderSearchListItem(query)

    fireEvent.press(getByRole('link'))

    expect(sendTrackingSignal).toHaveBeenCalledWith({
      signal: {
        name: SEARCH_FINISHED_SIGNAL_NAME,
        query,
        url: expect.any(String),
      },
    })
  })

  it('should render with thumbnail when provided', () => {
    renderSearchListItem('')
    expect(CategoryThumbnail).toHaveBeenCalled()
  })

  it('should render without thumbnail when not provided', () => {
    renderSearchListItem('', null)
    expect(CategoryThumbnail).not.toHaveBeenCalled()
  })
})
