import 'raf/polyfill'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import EndpointBuilder from './modules/endpoint/EndpointBuilder'
import LanguageModel from './modules/endpoint/models/LanguageModel'
import EventModel from './modules/endpoint/models/EventModel'

configure({adapter: new Adapter()})

// Setup fetch mock
global.fetch = require('jest-fetch-mock')

const events = [
  new EventModel({
    id: 1234,
    title: 'first Event',
    availableLanguages: {de: '1235', ar: '1236'}
  }),
  new EventModel({
    id: 1235,
    title: 'erstes Event',
    availableLanguages: {en: '1234', ar: '1236'}
  }),
  new EventModel({
    id: 2,
    title: 'second Event'
  })
]

const languages = [
  new LanguageModel('en', 'English'),
  new LanguageModel('de', 'Deutsch'),
  new LanguageModel('ar', 'Arabic')
]

const mockEventsEndpoint = new EndpointBuilder('events')
  .withUrl('https://weird-endpoint/api.json')
  .withMapper(json => json)
  .withResponseOverride(events)
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
  .withResponseOverride({})
  .build()
jest.mock('modules/endpoint/endpoints/categories', () => mockCategoriesEndpoint)

const mockLocationsEndpoint = new EndpointBuilder('locations')
  .withUrl('https://weird-endpoint/api.json')
  .withMapper(json => json)
  .withResponseOverride({})
  .build()
jest.mock('modules/endpoint/endpoints/locations', () => mockLocationsEndpoint)
