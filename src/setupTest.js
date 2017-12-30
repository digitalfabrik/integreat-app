import 'raf/polyfill'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import EndpointBuilder from './modules/endpoint/EndpointBuilder'
import LanguageModel from './modules/endpoint/models/LanguageModel'
import EventModel from './modules/endpoint/models/EventModel'
import DisclaimerModel from './modules/endpoint/models/DisclaimerModel'

configure({adapter: new Adapter()})

// Setup fetch mock
global.fetch = require('jest-fetch-mock')

const languages = [
  new LanguageModel('de', 'Deutsch'),
  new LanguageModel('en', 'English')
]

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
  .withResponseOverride({})
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
  .withResponseOverride(new DisclaimerModel({id: 1234, title: 'Disclaimer', content: 'test content'}))
  .build()
jest.mock('modules/endpoint/endpoints/disclaimer', () => mockDisclaimerEndpoint)
