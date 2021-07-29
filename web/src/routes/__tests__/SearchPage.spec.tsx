import { fireEvent } from '@testing-library/react'
import { CategoriesMapModel, CategoryModel, SEARCH_ROUTE } from 'api-client'
import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'
import moment from 'moment'
import React from 'react'
import { Route } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import LanguageModelBuilder from '../../../../api-client/src/testing/LanguageModelBuilder'
import buildConfig from '../../constants/buildConfig'
import { renderWithBrowserRouter } from '../../testing/render'
import { createPath, RoutePatterns } from '../index'
import SearchPage from '../SearchPage'
import { mockUseLoadFromEndpointWitData } from '../../../../api-client/src/testing/mockUseLoadFromEndpoint'

jest.mock('api-client', () => {
  return {
    ...jest.requireActual('api-client'),
    useLoadFromEndpoint: jest.fn()
  }
})

describe('SearchPage', () => {
  const categoryModels = [
    new CategoryModel({
      root: true,
      path: '/augsburg/en/',
      title: 'Augsburg',
      content: '',
      parentPath: '/augsburg/en',
      order: 75,
      availableLanguages: new Map([['de', '/augsburg/de/']]),
      thumbnail: 'https://cms.integreat-ap…/03/Hotline-150x150.png',
      lastUpdate: moment('2016-01-07 10:36:24'),
      hash: '91d435afbc7aa83496137e81fd2832e3'
    }),
    new CategoryModel({
      root: false,
      path: '/augsburg/en/welcome',
      title: 'Welcome',
      content: '',
      parentPath: '/augsburg/en',
      order: 75,
      availableLanguages: new Map([['de', '/augsburg/de/willkommen']]),
      thumbnail: 'https://cms.integreat-ap…/03/Hotline-150x150.png',
      lastUpdate: moment('2016-01-07 10:36:24'),
      hash: '91d435afbc7aa83496137e81fd2832e3'
    })
  ]

  const cities = new CityModelBuilder(2).build()
  const cityModel = cities[0]
  const languages = new LanguageModelBuilder(2).build()
  const languageModel = languages[0]

  const categories = new CategoriesMapModel(categoryModels)

  it('should filter correctly', () => {
    mockUseLoadFromEndpointWitData(categories)

    const { getByText, queryByText, getByPlaceholderText } = renderWithBrowserRouter(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <Route
          path={RoutePatterns[SEARCH_ROUTE]}
          render={props => (
            <SearchPage
              cities={cities}
              cityModel={cityModel}
              languages={languages}
              languageModel={languageModel}
              {...props}
            />
          )}
        />
      </ThemeProvider>,
      { route: createPath(SEARCH_ROUTE, { cityCode: cityModel.code, languageCode: languageModel.code }) }
    )

    // the root category should not be returned
    expect(queryByText(categoryModels[0].title)).toBeFalsy()
    expect(getByText(categoryModels[1].title)).toBeTruthy()

    fireEvent.change(getByPlaceholderText('searchPlaceholder'), {
      target: {
        value: 'Does not exist!'
      }
    })

    expect(queryByText(categoryModels[0].title)).toBeFalsy()
    expect(queryByText(categoryModels[1].title)).toBeFalsy()

    fireEvent.change(getByPlaceholderText('searchPlaceholder'), {
      target: {
        value: categoryModels[1].title
      }
    })

    expect(queryByText(categoryModels[0].title)).toBeFalsy()
    expect(getByText(categoryModels[1].title)).toBeTruthy()
  })

  it('should sort correctly', () => {
    const categoryModels = [
      // should be 1st because 'abc' is in the title and it is lexicographically smaller than category 2
      new CategoryModel({
        root: false,
        path: '/abc',
        title: 'abc-category',
        content: '',
        parentPath: '/',
        order: 1,
        availableLanguages: new Map(),
        thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png',
        hash: '2fe6283485a93932',
        lastUpdate: moment('2017-11-18T19:30:00.000Z')
      }),
      // should be 2nd because 'abc' is in the title but it is lexicographically bigger than category 1
      new CategoryModel({
        root: false,
        path: '/defabc',
        title: 'defabc-category',
        content: '',
        parentPath: '/',
        order: 1,
        availableLanguages: new Map(),
        thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png',
        hash: '2fe6283485b93932',
        lastUpdate: moment('2017-11-18T19:30:00.000Z')
      }),
      // should be 3rd because 'abc' is only in the content and the title is lexicographically smaller than category 4
      new CategoryModel({
        root: false,
        path: '/def',
        title: 'def-category',
        content: 'abc',
        parentPath: '/',
        order: 1,
        availableLanguages: new Map(),
        thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png',
        hash: '2fe6283485c93932',
        lastUpdate: moment('2017-11-18T19:30:00.000Z')
      }),
      // should be 4th because 'abc' is only in the content and the title is lexicographically bigger than category 3
      new CategoryModel({
        root: false,
        path: '/ghi',
        title: 'ghi-category',
        content: 'abc',
        parentPath: '/',
        order: 1,
        availableLanguages: new Map(),
        thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png',
        hash: '2fe6283485d93932',
        lastUpdate: moment('2017-11-18T19:30:00.000Z')
      })
    ]
    const categories = new CategoriesMapModel(categoryModels)
    mockUseLoadFromEndpointWitData(categories)

    const { getByPlaceholderText, getAllByLabelText } = renderWithBrowserRouter(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <Route
          path={RoutePatterns[SEARCH_ROUTE]}
          render={props => (
            <SearchPage
              cities={cities}
              cityModel={cityModel}
              languages={languages}
              languageModel={languageModel}
              {...props}
            />
          )}
        />
      </ThemeProvider>,
      { route: createPath(SEARCH_ROUTE, { cityCode: cityModel.code, languageCode: languageModel.code }) }
    )

    fireEvent.change(getByPlaceholderText('searchPlaceholder'), {
      target: {
        value: 'abc'
      }
    })

    const searchResults = getAllByLabelText('category', { exact: false })

    expect(searchResults[0].attributes.getNamedItem('aria-label')?.value).toBe(categoryModels[0].title)
    expect(searchResults[1].attributes.getNamedItem('aria-label')?.value).toBe(categoryModels[1].title)
    expect(searchResults[2].attributes.getNamedItem('aria-label')?.value).toBe(categoryModels[2].title)
    expect(searchResults[3].attributes.getNamedItem('aria-label')?.value).toBe(categoryModels[3].title)
  })

  describe('url query', () => {
    mockUseLoadFromEndpointWitData(categories)
    it('should set state from url', () => {
      const query = '?query=SearchForThis'
      const path = createPath(SEARCH_ROUTE, { cityCode: cityModel.code, languageCode: languageModel.code })
      const url = `${path}${query}`

      const { getByPlaceholderText } = renderWithBrowserRouter(
        <ThemeProvider theme={buildConfig().lightTheme}>
          <Route
            path={RoutePatterns[SEARCH_ROUTE]}
            render={props => (
              <SearchPage
                cities={cities}
                cityModel={cityModel}
                languages={languages}
                languageModel={languageModel}
                {...props}
              />
            )}
          />
        </ThemeProvider>,
        { route: url }
      )

      expect((getByPlaceholderText('searchPlaceholder') as HTMLInputElement).value).toBe('SearchForThis')
    })
  })

  it('should set url when state changes', () => {
    const { getByPlaceholderText } = renderWithBrowserRouter(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <Route
          path={RoutePatterns[SEARCH_ROUTE]}
          render={props => (
            <SearchPage
              cities={cities}
              cityModel={cityModel}
              languages={languages}
              languageModel={languageModel}
              {...props}
            />
          )}
        />
      </ThemeProvider>,
      { route: createPath(SEARCH_ROUTE, { cityCode: cityModel.code, languageCode: languageModel.code }) }
    )

    fireEvent.change(getByPlaceholderText('searchPlaceholder'), {
      target: {
        value: 'ChangeToThis'
      }
    })

    expect(global.window.location.href).toMatch(/\?query=ChangeToThis/)
  })

  it('should remove ?query= when filteredText is empty', () => {
    const query = '?query=RemoveThis'
    const path = createPath(SEARCH_ROUTE, { cityCode: cityModel.code, languageCode: languageModel.code })
    const url = `${path}${query}`

    const { getByPlaceholderText } = renderWithBrowserRouter(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <Route
          path={RoutePatterns[SEARCH_ROUTE]}
          render={props => (
            <SearchPage
              cities={cities}
              cityModel={cityModel}
              languages={languages}
              languageModel={languageModel}
              {...props}
            />
          )}
        />
      </ThemeProvider>,
      { route: url }
    )

    fireEvent.change(getByPlaceholderText('searchPlaceholder'), {
      target: {
        value: ''
      }
    })

    expect(global.window.location.href).toMatch(/^((?!\?query=).)*$/)
  })
})
