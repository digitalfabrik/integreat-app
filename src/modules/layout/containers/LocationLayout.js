// @flow

import * as React from 'react'
import { connect } from 'react-redux'

import GeneralHeader from '../components/GeneralHeader'
import Layout from '../components/Layout'
import GeneralFooter from '../components/GeneralFooter'
import LocationHeader from './LocationHeader'
import LocationFooter from '../components/LocationFooter'
import CategoriesToolbar from '../../../routes/categories/containers/CategoriesToolbar'
import { CategoriesMapModel, EventModel, ExtraModel, PageModel, CityModel } from '@integreat-app/integreat-api-client'
import type { LocationState } from 'redux-first-router'
import FeedbackModal from '../../feedback/components/FeedbackModal'
import LocationToolbar from '../components/LocationToolbar'
import type { Dispatch } from 'redux'
import toggleDarkModeAction from '../../theme/actions/toggleDarkMode'
import { CATEGORIES_ROUTE } from '../../app/route-configs/CategoriesRouteConfig'
import { EVENTS_ROUTE } from '../../app/route-configs/EventsRouteConfig'
import { SPRUNGBRETT_EXTRA, SPRUNGBRETT_ROUTE } from '../../app/route-configs/SprungbrettRouteConfig'
import { WOHNEN_EXTRA, WOHNEN_ROUTE } from '../../app/route-configs/WohnenRouteConfig'
import { DISCLAIMER_ROUTE } from '../../app/route-configs/DisclaimerRouteConfig'
import { SEARCH_ROUTE } from '../../app/route-configs/SearchRouteConfig'
import { EXTRAS_ROUTE } from '../../app/route-configs/ExtrasRouteConfig'

export type FeedbackRatingType = 'up' | 'down'

type PropsType = {|
  cities: ?Array<CityModel>,
  categories: ?CategoriesMapModel,
  events: ?Array<EventModel>,
  extras: ?Array<ExtraModel>,
  disclaimer: ?PageModel,
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
    if (this.state.footerClicked >= DARK_THEME_CLICK_COUNT - 1) {
      this.props.toggleDarkMode()
    }
    this.setState(prevState => {
      return ({...prevState, footerClicked: prevState.footerClicked + 1})
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

// fixme: WEBAPP-400 Dispatch type is not correct
const mapDispatchToProps = (dispatch: Dispatch<{ type: 'TOGGLE_DARK_MODE' }>) => ({
  toggleDarkMode: () => dispatch(toggleDarkModeAction())
})

export default connect(mapStateToProps, mapDispatchToProps)(LocationLayout)
