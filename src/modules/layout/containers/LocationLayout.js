// @flow

import * as React from 'react'
import { connect } from 'react-redux'

import CityModel from 'modules/endpoint/models/CityModel'

import GeneralHeader from '../components/GeneralHeader'
import Layout from '../components/Layout'
import GeneralFooter from '../components/GeneralFooter'
import LocationHeader from './LocationHeader'
import LocationFooter from '../components/LocationFooter'
import { CATEGORIES_ROUTE } from '../../app/routes/categories'
import { EVENTS_ROUTE } from '../../app/routes/events'
import { EXTRAS_ROUTE } from '../../app/routes/extras'
import { DISCLAIMER_ROUTE } from '../../app/routes/disclaimer'
import { SEARCH_ROUTE } from '../../app/routes/search'
import CategoriesToolbar from '../../../routes/categories/containers/CategoriesToolbar'
import CategoriesMapModel from '../../endpoint/models/CategoriesMapModel'
import { SPRUNGBRETT_EXTRA, SPRUNGBRETT_ROUTE } from '../../app/routes/sprungbrett'
import { WOHNEN_EXTRA, WOHNEN_ROUTE } from '../../app/routes/wohnen'
import type { LocationState } from 'redux-first-router'
import FeedbackModal from '../../feedback/components/FeedbackModal'
import LocationToolbar from '../components/LocationToolbar'
import EventModel from '../../endpoint/models/EventModel'
import ExtraModel from '../../endpoint/models/ExtraModel'
import DisclaimerModel from '../../endpoint/models/DisclaimerModel'
import type { Dispatch } from 'redux'
import toggleDarkModeAction from '../../theme/actions/toggleDarkMode'
import { POIS_ROUTE } from '../../app/routes/pois'

export const LocationLayoutRoutes = [CATEGORIES_ROUTE, EVENTS_ROUTE, EXTRAS_ROUTE, SPRUNGBRETT_ROUTE, WOHNEN_ROUTE,
  DISCLAIMER_ROUTE, SEARCH_ROUTE, POIS_ROUTE]

export type FeedbackRatingType = 'up' | 'down'

type PropsType = {|
  cities: ?Array<CityModel>,
  categories: ?CategoriesMapModel,
  events: ?Array<EventModel>,
  extras: ?Array<ExtraModel>,
  disclaimer: ?DisclaimerModel,
  viewportSmall: boolean,
  children?: React.Node,
  location: LocationState,
  toggleDarkMode: () => void,
  darkMode: boolean
|}

type LocalStateType = {|
  asideStickyTop: number,
  feedbackModalRating: ?FeedbackRatingType,
  footerClicked: number
|}

const DARK_THEME_CLICK_COUNT = 5

export class LocationLayout extends React.Component<PropsType, LocalStateType> {
  state = {asideStickyTop: 0, feedbackModalRating: null, footerClicked: 0}

  onStickyTopChanged = (asideStickyTop: number) => this.setState({asideStickyTop})

  onFooterClicked = () => {
    this.setState(prevState => {
      if (prevState.footerClicked < DARK_THEME_CLICK_COUNT) {
        return ({...prevState, footerClicked: prevState.footerClicked + 1})
      } else {
        this.props.toggleDarkMode()
      }
    })
  }

  getCurrentCity (): ?CityModel {
    const {location, cities} = this.props
    const city = location.payload.city

    return cities && cities.find(_city => _city.code === city)
  }

  renderFeedbackModal = (): React.Node => {
    if (!this.state.feedbackModalRating) {
      return null
    }

    const {cities, location, categories, events, extras, disclaimer} = this.props
    const payload = location.payload

    let id
    let title
    let alias
    if (location.type === CATEGORIES_ROUTE && categories) {
      const category = categories.findCategoryByPath(location.pathname)
      if (category) {
        id = category.id
        title = category.title
      }
    }

    if (location.type === EVENTS_ROUTE && events) {
      const event = events.find(event => event.id === payload.eventId)
      if (event) {
        id = event.id
        title = event.title
      }
    }

    if (location.type === SPRUNGBRETT_ROUTE) {
      alias = SPRUNGBRETT_EXTRA
    } else if (location.type === WOHNEN_ROUTE) {
      alias = WOHNEN_EXTRA
    }
    if (alias && extras) {
      const extra = extras.find(extra => extra.alias === alias)
      if (extra) {
        title = extra.title
      }
    }

    if (location.type === DISCLAIMER_ROUTE && disclaimer) {
      id = disclaimer.id
    }

    return <FeedbackModal
      id={id}
      title={title}
      alias={alias}
      cities={cities}
      feedbackStatus={this.state.feedbackModalRating}
      closeFeedbackModal={this.closeFeedbackModal}
      location={location}
      extras={extras} />
  }

  openFeedbackModal = (rating: FeedbackRatingType) => this.setState({feedbackModalRating: rating})

  closeFeedbackModal = () => this.setState({feedbackModalRating: null})

  renderToolbar = (): React.Node => {
    const {location, categories} = this.props
    const type = location.type

    if (type === CATEGORIES_ROUTE) {
      return <CategoriesToolbar categories={categories} location={location}
                                openFeedbackModal={this.openFeedbackModal} />
    } else if ([EXTRAS_ROUTE, EVENTS_ROUTE, DISCLAIMER_ROUTE, WOHNEN_ROUTE, SPRUNGBRETT_ROUTE].includes(type)) {
      return <LocationToolbar openFeedbackModal={this.openFeedbackModal} />
    } else {
      return null
    }
  }

  render () {
    const {viewportSmall, children, location, darkMode} = this.props
    const type = location.type
    const {city, language} = location.payload

    const cityModel = this.getCurrentCity()

    if (!cityModel) {
      return <Layout header={<GeneralHeader viewportSmall={viewportSmall} />}
                     footer={<GeneralFooter />}>
        {children}
      </Layout>
    }

    return <Layout asideStickyTop={this.state.asideStickyTop}
                   header={<LocationHeader isEventsEnabled={cityModel.eventsEnabled}
                                           isExtrasEnabled={cityModel.extrasEnabled}
                                           onStickyTopChanged={this.onStickyTopChanged} />}
                   footer={<LocationFooter onClick={this.onFooterClicked} city={city} language={language} />}
                   toolbar={this.renderToolbar()}
                   modal={type !== SEARCH_ROUTE && this.renderFeedbackModal()}
                   darkMode={darkMode}>
      {children}
    </Layout>
  }
}

const mapStateToProps = state => ({
  location: state.location,
  viewportSmall: state.viewport.is.small,
  cities: state.cities.data,
  categories: state.categories.data,
  events: state.events.data,
  extras: state.extras.data,
  disclaimer: state.disclaimer.data,
  darkMode: state.darkMode
})

const mapDispatchToProps = (dispatch: Dispatch<{ type: string }>) => ({
  toggleDarkMode: action => dispatch(toggleDarkModeAction(action))
})

export default connect(mapStateToProps, mapDispatchToProps)(LocationLayout)
