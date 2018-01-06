import React from 'react'
import { shallow } from 'enzyme/build/index'
import { SearchPage } from '../SearchPage'
import LanguageModel from '../../../../modules/endpoint/models/LanguageModel'
import CategoryModel from '../../../../modules/endpoint/models/CategoryModel'
import CategoriesMapModel from '../../../../modules/endpoint/models/CategoriesMapModel'

describe('SearchPage', () => {
  const location = 'augsburg'

  const languages = [
    new LanguageModel('en', 'English'),
    new LanguageModel('de', 'Deutsch'),
    new LanguageModel('ar', 'Arabic')
  ]

  const categoryModels = [
    new CategoryModel({
      id: 0,
      url: '/augsburg/de',
      title: 'augsburg'
    }),
    new CategoryModel({
      id: 3650,
      url: '/augsburg/de/anlaufstellen',
      title: 'Anlaufstellen zu sonstigen Themen',
      content: '',
      parentId: 0,
      parentUrl: '/augsburg/de',
      order: 75,
      availableLanguages: {
        en: 4361, ar: 4367, fa: 4368
      },
      thumbnail: 'https://cms.integreat-ap…/03/Hotline-150x150.png'
    }),
    new CategoryModel({
      id: 3649,
      url: '/augsburg/de/willkommen',
      title: 'Willkommen',
      content: '',
      parentId: 0,
      parentUrl: '/augsburg/de',
      order: 11,
      availableLanguages: {
        en: 4804, ar: 4819, fa: 4827
      },
      thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png'
    }),
    new CategoryModel({
      id: 35,
      url: '/augsburg/de/willkommen/willkommen-in-augsburg',
      title: 'Willkommen in Augsburg',
      content: '<p>Willkommen in Augsbur…er Stadt Augsburg</p>\n',
      parentId: 3649,
      parentUrl: '/augsburg/de/willkommen',
      order: 1,
      availableLanguages: {
        en: '390',
        de: '711',
        ar: '397'
      },
      thumbnail: 'https://cms.integreat-ap…09/heart295-150x150.png'
    })
  ]

  const categories = new CategoriesMapModel(categoryModels)

  test('should match snapshot', () => {
    const wrapper = shallow(<SearchPage location={location}
                                        languages={languages}
                                        categories={categories}
                                        setLanguageChangeUrls={() => {}} />)
    expect(wrapper).toMatchSnapshot()
  })

  test('should dispatch once in componentDidMount', () => {
    const mockSetLanguageChangeUrls = jest.fn()

    const searchPage = shallow(<SearchPage location={location}
                                               languages={languages}
                                               categories={categories}
                                               setLanguageChangeUrls={mockSetLanguageChangeUrls} />
    ).instance()

    expect(mockSetLanguageChangeUrls.mock.calls).toHaveLength(1)
    expect(mockSetLanguageChangeUrls).toBeCalledWith(searchPage.mapLanguageToUrl, languages)
  })

  test('should mapLanguageToUrl correctly', () => {
    const searchPage = shallow(
      <SearchPage location={location}
                  languages={languages}
                  categories={categories}
                  setLanguageChangeUrls={() => {}} />
    ).instance()
    expect(searchPage.mapLanguageToUrl('en')).toBe('/augsburg/en/search')
  })
})
