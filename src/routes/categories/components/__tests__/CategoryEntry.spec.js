// @flow

import React from 'react'
import { shallow, type ShallowWrapper } from 'enzyme'
import moment from 'moment'
import CategoryEntry from '../CategoryEntry'
import { CategoryModel } from '@integreat-app/integreat-api-client'
import iconPlaceholder from '../../assets/IconPlaceholder.svg'
import { brightTheme } from '../../../../modules/theme/constants/theme'
import normalizeSearchString from '../../../../modules/common/utils/normalizeSearchString'

const category = new CategoryModel({
  root: false,
  path: '/augsburg/de/willkommen',
  title: 'Willkommen',
  content: 'this is a test content which is longer than usual',
  parentPath: '/augsburg/de',
  order: 11,
  availableLanguages: new Map([['en', '4861'], ['ar', '4867'], ['fa', '4868']]),
  thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png',
  lastUpdate: moment('2017-11-18T19:30:00.000Z'),
  hash: 'a36a56'
})
const childCategory = new CategoryModel({
  root: false,
  path: '/augsburg/de/test',
  title: 'Child',
  content: 'this is a test content',
  parentPath: '/augsburg/de',
  order: 11,
  availableLanguages: new Map([['en', '4861'], ['ar', '4867'], ['fa', '4868']]),
  thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png',
  lastUpdate: moment('2017-11-18T19:30:00.000Z'),
  hash: 'a36a57'
})
const noContentCategory = new CategoryModel({
  root: false,
  path: '/augsburg/de/test',
  title: 'Child',
  content: '',
  parentPath: '/augsburg/de',
  order: 11,
  availableLanguages: new Map([['en', '4861'], ['ar', '4867'], ['fa', '4868']]),
  thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png',
  lastUpdate: moment('2017-11-18T19:30:00.000Z'),
  hash: 'a36a57'
})
const noThumbCategory = new CategoryModel({
  root: false,
  path: '/augsburg/de/willkommen/willkommen-in-augsburg',
  title: 'GotNoThumb :O',
  content: 'some content',
  parentPath: '/augsburg/de/willkommen',
  order: 1,
  availableLanguages: new Map([['en', '390'], ['ar', '711'], ['fa', '397']]),
  thumbnail: '',
  lastUpdate: moment('2017-11-18T19:30:00.000Z'),
  hash: 'a36a58'
})

// helper to find StyledComponents without importing them
function findComponent (wrapper: ShallowWrapper<*>, name: string): ShallowWrapper<*> {
  return wrapper.findWhere(n => n.name().endsWith(name))
}

describe('CategoryEntry', () => {
  it('should render and match snapshot', () => {
    const wrapper = shallow(<CategoryEntry
      theme={brightTheme}
      category={category}
      subCategories={[childCategory]} />
    ).dive()

    expect(findComponent(wrapper, 'StyledLink').at(0).prop('to')).toEqual(category.path)
    expect(findComponent(wrapper, 'CategoryThumbnail').prop('src')).toEqual(category.thumbnail)
    expect(findComponent(wrapper, 'Highlighter').props()).toEqual(expect.objectContaining({
      'aria-label': category.title,
      searchWords: [],
      sanitize: normalizeSearchString,
      textToHighlight: category.title
    }))

    expect(wrapper.exists('div')).toBe(true)
    expect(findComponent(wrapper, 'SubCategory').key()).toEqual(childCategory.hash)
    expect(findComponent(wrapper, 'StyledLink').at(1).prop('to')).toEqual(childCategory.path)
    expect(findComponent(wrapper, 'SubCategoryCaption').props()).toEqual({
      'aria-label': childCategory.title,
      searchWords: [],
      textToHighlight: childCategory.title
    })
  })

  it('should replace empty thumbnail', () => {
    const wrapper = shallow(<CategoryEntry
      theme={brightTheme}
      category={noThumbCategory}
      subCategories={[childCategory]} />
    ).dive()

    expect(findComponent(wrapper, 'CategoryThumbnail').prop('src')).toEqual(iconPlaceholder)
  })

  describe('getWords', () => {
    const wrapper = shallow(
      <CategoryEntry theme={brightTheme} category={noThumbCategory} subCategories={[noThumbCategory]} />
    ).dive()

    it('should return empty list for an empty input', () => {
      const testString = ''
      const categoryEntry = wrapper.instance()
      expect(categoryEntry.getWords(testString)).toEqual([])
    })

    it('should split text into words and remove all whitespace characters', () => {
      const testString = ' a \tb \r\nc\n\nd-e ,f :g /h'
      const categoryEntry = wrapper.instance()
      expect(categoryEntry.getWords(testString)).toEqual(['a', 'b', 'c', 'd-e', ',f', ':g', '/h'])
    })
  })

  describe('getMatchedContent', () => {
    const numWords = 3

    describe('getContentBeforeMatchIdx', () => {
      it('should return 3 words before the specified index an start of the word', () => {
        const content = 'This is some test content'
        const matchIdx = 15
        const wrapper = shallow(
            <CategoryEntry theme={brightTheme}
                           category={category}
                           contentWithoutHtml={category.content}
                           subCategories={[]} />
        ).dive()
        const categoryEntry = wrapper.instance()
        expect(categoryEntry.getContentBeforeMatchIdx(content, matchIdx, false, numWords))
          .toBe('This is some te')
      })

      it('should return 3 words before the specified index', () => {
        const content = 'This is some test content'
        const matchIdx = 13
        const wrapper = shallow(
          <CategoryEntry theme={brightTheme}
                         category={category}
                         contentWithoutHtml={category.content}
                         subCategories={[]} />
        ).dive()
        const categoryEntry = wrapper.instance()
        expect(categoryEntry.getContentBeforeMatchIdx(content, matchIdx, true, numWords))
          .toBe('This is some ')
      })
    })

    describe('getMatchedContentAfterMatchIdx', () => {
      it('should return 3 words before the specified index an start of the word', () => {
        const content = 'This is some test content'
        const matchIdx = 1
        const wrapper = shallow(
          <CategoryEntry theme={brightTheme}
                         category={category}
                         contentWithoutHtml={category.content}
                         subCategories={[]} />
        ).dive()
        const categoryEntry = wrapper.instance()
        expect(categoryEntry.getContentAfterMatchIdx(content, matchIdx, numWords))
          .toBe('his is some test')
      })

      it('should return 3 words before the specified index', () => {
        const content = 'This is some test content'
        const matchIdx = 0
        const wrapper = shallow(
          <CategoryEntry theme={brightTheme}
                         category={category}
                         contentWithoutHtml={category.content}
                         subCategories={[]} />
        ).dive()
        const categoryEntry = wrapper.instance()
        expect(categoryEntry.getContentAfterMatchIdx(content, matchIdx, numWords))
          .toBe('This is some test')
      })
    })

    it('should return null for undefined query', () => {
      const wrapper = shallow(
        <CategoryEntry theme={brightTheme}
                       category={noThumbCategory}
                       contentWithoutHptml={noThumbCategory.content}
                       subCategories={[]} />
      ).dive()
      const categoryEntry = wrapper.instance()
      expect(categoryEntry.getMatchedContent(numWords)).toBeNull()
    })

    it('should return null for categories without content', () => {
      const wrapper = shallow(
        <CategoryEntry theme={brightTheme} category={noContentCategory} query='abc' subCategories={[]} />
      ).dive()
      const categoryEntry = wrapper.instance()
      expect(categoryEntry.getMatchedContent(numWords)).toBeNull()
    })

    it('should return null for empty query', () => {
      const wrapper = shallow(
        <CategoryEntry theme={brightTheme}
                       category={noThumbCategory}
                       contentWithoutHtml={noThumbCategory.content}
                       query=''
                       subCategories={[]} />
      ).dive()
      const categoryEntry = wrapper.instance()
      expect(categoryEntry.getMatchedContent(numWords)).toBeNull()
    })

    it('should return the match with query starting at the beginning of a word', () => {
      const query = 'test'
      const selectedSection = 'this is a test content which is'
      const numWords = 3
      const wrapper = shallow(
        <CategoryEntry theme={brightTheme}
                       category={category}
                       contentWithoutHtml={category.content}
                       query={query}
                       subCategories={[]} />
      ).dive()
      const categoryEntry = wrapper.instance()
      const contentMatchItem = shallow(categoryEntry.getMatchedContent(numWords))
      const contentMatchProps = contentMatchItem.props()
      expect(contentMatchProps['aria-label']).toEqual(selectedSection)
      expect(contentMatchProps.sanitize).toEqual(normalizeSearchString)
      expect(contentMatchProps.searchWords).toHaveLength(1)
      expect(contentMatchProps.searchWords).toContain(query)
      expect(contentMatchProps.textToHighlight).toEqual(selectedSection)
    })

    it('should match the same for query matching whole word and query matching in between a word', () => {
      const completeWordQuery = 'test'
      const inBetweenWordQuery = 'es'
      const wrapper = shallow(
        <CategoryEntry theme={brightTheme}
                       category={category}
                       contentWithoutHtml={category.content}
                       query={completeWordQuery}
                       subCategories={[]} />
      ).dive()
      const categoryEntry = wrapper.instance()
      const contentMatchItem = shallow(categoryEntry.getMatchedContent(numWords))
      const contentMatchProps = contentMatchItem.props()

      const wrapperWithDifferentQuery = shallow(
        <CategoryEntry theme={brightTheme}
                       category={category}
                       contentWithoutHtml={category.content}
                       query={inBetweenWordQuery}
                       subCategories={[]} />
      ).dive()
      const categoryEntryWithDifferentQuery = wrapperWithDifferentQuery.instance()
      const contentMatchItemWithDifferentQuery = shallow(categoryEntryWithDifferentQuery.getMatchedContent(numWords))
      const contentMatchPropsWithDifferentQuery = contentMatchItemWithDifferentQuery.props()

      expect(contentMatchPropsWithDifferentQuery.searchWords).toHaveLength(1)
      expect(contentMatchPropsWithDifferentQuery.searchWords).toContain(inBetweenWordQuery)
      expect(contentMatchPropsWithDifferentQuery).toEqual({ ...contentMatchProps, searchWords: ['es'] })
    })
  })
})
