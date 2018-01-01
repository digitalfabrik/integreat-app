import 'raf/polyfill'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import EndpointBuilder from './modules/endpoint/EndpointBuilder'
import LanguageModel from './modules/endpoint/models/LanguageModel'
import DisclaimerModel from './modules/endpoint/models/DisclaimerModel'
import CategoryModel from './modules/endpoint/models/CategoryModel'
import CategoriesMapModel from './modules/endpoint/models/CategoriesMapModel'

configure({adapter: new Adapter()})

// Setup fetch mock
global.fetch = require('jest-fetch-mock')

const languages = [
  new LanguageModel('de', 'Deutsch'),
  new LanguageModel('en', 'English')
]

const categories = new CategoriesMapModel([
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
  new CategoryModel({id: 0, url: '/augsburg/de', title: 'augsburg'})
])

const disclaimer = new DisclaimerModel({
  id: 1234,
  title: 'Disclaimer',
  content: 'Disclaimer test content'
})

const mockEventsEndpoint = new EndpointBuilder('events')
  .withUrl('https://weird-endpoint/api.json')
  .withMapper(json => json)
  .withResponseOverride({})
  .build()
jest.mock('modules/endpoint/endpoints/events', () => mockEventsEndpoint)

const mockLanguagesEndpoint = new EndpointBuilder('languages')
  .withUrl('https://weird-endpoint/api.json')
  .withMapper(json => json)
  .withResponseOverride(languages)
  .build()
jest.mock('modules/endpoint/endpoints/languages', () => mockLanguagesEndpoint)

const mockCategoriesEndpoint = new EndpointBuilder('categories')
  .withUrl('https://weird-endpoint/api.json')
  .withMapper(json => json)
  .withResponseOverride(categories)
  .build()
jest.mock('modules/endpoint/endpoints/categories', () => mockCategoriesEndpoint)

const mockLocationsEndpoint = new EndpointBuilder('locations')
  .withUrl('https://weird-endpoint/api.json')
  .withMapper(json => json)
  .withResponseOverride({})
  .build()
jest.mock('modules/endpoint/endpoints/locations', () => mockLocationsEndpoint)

const mockDisclaimerEndpoint = new EndpointBuilder('disclaimer')
  .withUrl('https://weird-endpoint/api.json')
  .withMapper(json => json)
  .withResponseOverride(disclaimer)
  .build()
jest.mock('modules/endpoint/endpoints/disclaimer', () => mockDisclaimerEndpoint)
