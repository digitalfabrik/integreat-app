import 'raf/polyfill'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import EndpointBuilder from './modules/endpoint/EndpointBuilder'

configure({adapter: new Adapter()})

// Setup fetch mock
global.fetch = require('jest-fetch-mock')

const mockEventsEndpoint = new EndpointBuilder('endpoint')
  .withUrl('https://weird-endpoint/api.json')
  .withMapper(json => json)
  .withResponseOverride({})
  .build()
jest.mock('modules/endpoint/endpoints/events', () => mockEventsEndpoint)

const mockLanguagesEndpoint = new EndpointBuilder('endpoint1')
  .withUrl('https://weird-endpoint/api.json')
  .withMapper(json => json)
  .withResponseOverride({})
  .build()
jest.mock('modules/endpoint/endpoints/languages', () => mockLanguagesEndpoint)
