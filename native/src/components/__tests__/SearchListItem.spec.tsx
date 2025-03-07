import React from 'react'

import { parseHTML } from 'shared'
import { CategoriesMapModelBuilder, CityModelBuilder, LanguageModelBuilder } from 'shared/api'

import render from '../../testing/render'
import SearchListItem from '../SearchListItem'

jest.mock('react-i18next')
jest.mock('styled-components')
jest.mock('@dr.pogodin/react-native-webview', () => ({
  default: () => jest.fn(),
}))

describe('SearchListItem', () => {
  const cityModel = new CityModelBuilder(1).build()[0]!
  const language = new LanguageModelBuilder(1).build()[0]!
  const { categories: categoriesMapModel, resourceCache } = new CategoriesMapModelBuilder(
    cityModel.code,
    language.code,
  ).buildAll()
  const categories = categoriesMapModel.toArray()
  const category = categories[1]!
  const contentWithoutHtml = parseHTML(category.content)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const assertHighlighting = (element: HTMLElement, highlighted: boolean) =>
    highlighted
      ? expect(element).toHaveStyle({ fontWeight: 'bold' })
      : expect(element).not.toHaveStyle({ fontWeight: 'bold' })

  const renderSearchListItem = (query: string) =>
    render(
      <SearchListItem
        contentWithoutHtml={contentWithoutHtml}
        query={query}
        language={language.code}
        title={category.title}
        path={category.path}
        thumbnail={category.thumbnail}
        resourceCache={resourceCache[category.path]!}
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

  it.skip('should show excerpt around query if only match in content', () => {
    const excerptBeforeQuery = 'This is a'
    const query = 'sample'
    const excerptAfterQuery = 'page'

    const { getByText } = renderSearchListItem(query)

    assertHighlighting(getByText(category.title), false)
    assertHighlighting(getByText(excerptBeforeQuery, { exact: false }), false)
    assertHighlighting(getByText(query), true)
    assertHighlighting(getByText(excerptAfterQuery, { exact: false }), false)
  })

  it.skip('should show title if the query is empty', () => {
    const query = ''

    const { getByText, queryByText } = renderSearchListItem(query)

    assertHighlighting(getByText(category.title), false)
    expect(queryByText(contentWithoutHtml)).toBeFalsy()
  })
})
