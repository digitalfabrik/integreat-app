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
