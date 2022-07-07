import moment from 'moment'
import React from 'react'
import { ThemeProvider } from 'styled-components'

import { CategoryModel } from 'api-client'

import iconPlaceholder from '../../assets/IconPlaceholder.svg'
import buildConfig from '../../constants/buildConfig'
import { renderWithRouter } from '../../testing/render'
import { CategoryEntry } from '../CategoryEntry'

const category = new CategoryModel({
  root: false,
  path: '/augsburg/de/willkommen',
  title: 'Willkommen',
  content: 'this is a test content which is longer than usual',
  parentPath: '/augsburg/de',
  order: 11,
  availableLanguages: new Map([
    ['en', '4861'],
    ['ar', '4867'],
    ['fa', '4868']
  ]),
  thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png',
  lastUpdate: moment('2017-11-18T19:30:00.000Z')
})
const childCategory = new CategoryModel({
  root: false,
  path: '/augsburg/de/test',
  title: 'Child',
  content: 'this is a test content',
  parentPath: '/augsburg/de',
  order: 11,
  availableLanguages: new Map([
    ['en', '4861'],
    ['ar', '4867'],
    ['fa', '4868']
  ]),
  thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png',
  lastUpdate: moment('2017-11-18T19:30:00.000Z')
})
const noThumbCategory = new CategoryModel({
  root: false,
  path: '/augsburg/de/willkommen/willkommen-in-augsburg',
  title: 'GotNoThumb :O',
  content: 'some content',
  parentPath: '/augsburg/de/willkommen',
  order: 1,
  availableLanguages: new Map([
    ['en', '390'],
    ['ar', '711'],
    ['fa', '397']
  ]),
  thumbnail: '',
  lastUpdate: moment('2017-11-18T19:30:00.000Z')
})

describe('CategoryEntry', () => {
  const lightTheme = buildConfig().lightTheme

  it('should render correctly', () => {
    const { getByText, getByRole, getByLabelText, queryAllByText } = renderWithRouter(
      <ThemeProvider theme={lightTheme}>
        <CategoryEntry theme={lightTheme} category={category} subCategories={[childCategory]} />
      </ThemeProvider>
    )

    expect(getByLabelText(category.title)).toBeTruthy()
    expect(getByText(category.title).closest('a')).toHaveProperty('href', `http://localhost${category.path}`)
    expect(getByRole('img')).toHaveProperty('src', category.thumbnail)

    expect(getByLabelText(childCategory.title)).toBeTruthy()
    expect(getByText(childCategory.title).closest('a')).toHaveProperty('href', `http://localhost${childCategory.path}`)

    const regex = /.+/
    const texts = queryAllByText(regex)
    // Only category.title and childCategory.title, nothing split up because of highlighting
    expect(texts).toHaveLength(2)
  })

  it('should replace empty thumbnail', () => {
    const { getByRole } = renderWithRouter(
      <ThemeProvider theme={lightTheme}>
        <CategoryEntry theme={lightTheme} category={noThumbCategory} subCategories={[childCategory]} />
      </ThemeProvider>
    )

    expect(getByRole('img')).toHaveProperty('src', `http://localhost/${iconPlaceholder}`)
  })

  describe('highlighted content', () => {
    it('should return the highlighted match item', () => {
      const query = 'test'
      const selectedSection = 'this is a test content which is longer than usual'
      const highlightStyle = {
        _values: {
          'background-color': 'rgb(255, 255, 255)',
          'font-weight': 'bold'
        }
      }

      const { getByText, getByLabelText } = renderWithRouter(
        <ThemeProvider theme={lightTheme}>
          <CategoryEntry
            theme={lightTheme}
            category={category}
            subCategories={[]}
            query={query}
            contentWithoutHtml={category.content}
          />
        </ThemeProvider>
      )

      expect(getByLabelText(selectedSection)).toBeTruthy()
      expect(getByText('this is a')).not.toHaveProperty('style', expect.objectContaining(highlightStyle))
      expect(getByText(query)).toHaveProperty('style', expect.objectContaining(highlightStyle))
      expect(getByText('content which is longer than usual')).not.toHaveProperty(
        'style',
        expect.objectContaining(highlightStyle)
      )
    })

    it('should highlight nothing and show no content if there is no match', () => {
      const query = 'no match'

      const { queryAllByText, getByText } = renderWithRouter(
        <ThemeProvider theme={lightTheme}>
          <CategoryEntry
            theme={lightTheme}
            category={category}
            subCategories={[]}
            query={query}
            contentWithoutHtml={category.content}
          />
        </ThemeProvider>
      )

      expect(getByText(category.title)).toBeTruthy()
      const regex = /.+/
      const texts = queryAllByText(regex)
      // Only category.title, nothing split up because of highlighting
      expect(texts).toHaveLength(1)
    })
  })
})
