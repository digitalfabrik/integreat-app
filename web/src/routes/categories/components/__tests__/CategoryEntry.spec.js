// @flow

import React from 'react'
import { shallow, type ShallowWrapper } from 'enzyme'
import moment from 'moment'
import { CategoryEntry } from '../CategoryEntry'
import { CategoryModel } from 'api-client'
import iconPlaceholder from '../../assets/IconPlaceholder.svg'
import { lightTheme } from '../../../../modules/theme/constants/theme'
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
  return wrapper.findWhere(n => n.name()?.endsWith(name))
}

describe('CategoryEntry', () => {
  it('should render and match snapshot', () => {
    const wrapper = shallow(<CategoryEntry
      theme={lightTheme}
      contentWithoutHtml={null}
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
      children: childCategory.title
    })
  })

  it('should replace empty thumbnail', () => {
    const wrapper = shallow(<CategoryEntry
      theme={lightTheme}
      contentWithoutHtml={null}
      category={noThumbCategory}
      subCategories={[childCategory]} />
    ).dive()

    expect(findComponent(wrapper, 'CategoryThumbnail').prop('src')).toEqual(iconPlaceholder)
  })

  describe('getMatchedContent', () => {
    it('should return the highlighted match item', () => {
      const query = 'test'
      const selectedSection = 'this is a test content which is'
      const numWords = 3
      const wrapper = shallow(
        <CategoryEntry category={category}
                       theme={lightTheme}
                       contentWithoutHtml={category.content}
                       query={query}
                       subCategories={[]} />
      )
      const categoryEntry = wrapper.instance()
      // $FlowFixMe React.Portal is incompatible
      const contentMatchItem = shallow(categoryEntry.getMatchedContent(numWords))
      const contentMatchProps = contentMatchItem.props()
      expect(contentMatchProps['aria-label']).toEqual(selectedSection)
      expect(contentMatchProps.sanitize).toEqual(normalizeSearchString)
      expect(contentMatchProps.searchWords).toHaveLength(1)
      expect(contentMatchProps.searchWords).toContain(query)
      expect(contentMatchProps.textToHighlight).toEqual(selectedSection)
    })

    it('should not return a match item', () => {
      const query = 'test'
      const numWords = 3
      const wrapper = shallow(
        <CategoryEntry category={category}
                       theme={lightTheme}
                       contentWithoutHtml={category.content}
                       query={query}
                       subCategories={[]} />
      )
      const categoryEntry = wrapper.instance()
      // $FlowFixMe getMatchedContent is not writable
      categoryEntry.contentMatcher.getMatchedContent = jest.fn()
      categoryEntry.contentMatcher.getMatchedContent.mockReturnValue(null)
      expect(categoryEntry.getMatchedContent(numWords)).toBeNull()
    })
  })
})
