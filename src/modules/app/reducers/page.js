import { NOT_FOUND } from 'redux-first-router'
import LandingPage from '../../../routes/landing/containers/LandingPage'
import MainDisclaimerPage from '../../../routes/main-disclaimer/components/MainDisclaimerPage'
import EventsPage from '../../../routes/events/containers/EventsPage'
import ExtrasPage from '../../../routes/extras/containers/ExtrasPage'
import DisclaimerPage from '../../../routes/disclaimer/containers/DisclaimerPage'
import SearchPage from '../../../routes/search/containers/SearchPage'
import CategoriesPage from '../../../routes/categories/containers/CategoriesPage'
import Failure from '../../common/components/Failure'

export default (state, action) => components[action.type] || state

const components = {
  LANDING: LandingPage,
  MAIN_DISCLAIMER: MainDisclaimerPage,
  EVENTS: EventsPage,
  EXTRAS: ExtrasPage,
  DISCLAIMER: DisclaimerPage,
  SEARCH: SearchPage,
  CATEGORIES: CategoriesPage,
  [NOT_FOUND]: Failure
}
