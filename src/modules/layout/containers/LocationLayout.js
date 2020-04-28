// @flow

import * as React from 'react'
import GeneralHeader from '../components/GeneralHeader'
import Layout from '../components/Layout'
import GeneralFooter from '../components/GeneralFooter'
import LocationHeader from './LocationHeader'
import LocationFooter from '../components/LocationFooter'
import CategoriesToolbar from '../../../routes/categories/containers/CategoriesToolbar'
import { CategoriesMapModel, CityModel, EventModel, LocalNewsModel } from '@integreat-app/integreat-api-client'
import type { LocationState } from 'redux-first-router'
import FeedbackModal from '../../feedback/components/FeedbackModal'
import LocationToolbar from '../components/LocationToolbar'
import { CATEGORIES_ROUTE } from '../../app/route-configs/CategoriesRouteConfig'
import { EVENTS_ROUTE } from '../../app/route-configs/EventsRouteConfig'
import { NEWS_ROUTE } from '../../app/route-configs/NewsRouteConfig'
import { SPRUNGBRETT_ROUTE } from '../../app/route-configs/SprungbrettRouteConfig'
import { WOHNEN_ROUTE } from '../../app/route-configs/WohnenRouteConfig'
import { DISCLAIMER_ROUTE } from '../../app/route-configs/DisclaimerRouteConfig'
import { SEARCH_ROUTE } from '../../app/route-configs/SearchRouteConfig'
import { EXTRAS_ROUTE } from '../../app/route-configs/ExtrasRouteConfig'
import type { FeedbackTargetInformationType } from '../../app/route-configs/RouteConfig'
import type { LanguageChangePathsType } from '../../app/containers/Switcher'

export type FeedbackRatingType = 'up' | 'down'

type PropsType = {|
  cities: ?Array<CityModel>,
  categories: ?CategoriesMapModel,
  events: ?Array<EventModel>,
  news: ?Array<LocalNewsModel>,
  viewportSmall: boolean,
  children?: React.Node,
  location: LocationState,
  toggleDarkMode: () => void,
  darkMode: boolean,
  feedbackTargetInformation: FeedbackTargetInformationType,
  languageChangePaths: ?LanguageChangePathsType
|}

type LocalStateType = {|
  asideStickyTop: number,
  feedbackModalRating: ?FeedbackRatingType,
  footerClicked: number
|}

const DARK_THEME_CLICK_COUNT = 5

export class LocationLayout extends React.Component<PropsType, LocalStateType> {
  state = { asideStickyTop: 0, feedbackModalRating: null, footerClicked: 0 }

  handleStickyTopChanged = (asideStickyTop: number) => this.setState({ asideStickyTop })

  handleFooterClicked = () => {
    if (this.state.footerClicked >= DARK_THEME_CLICK_COUNT - 1) {
      this.props.toggleDarkMode()
    }
    this.setState(prevState => {
      return ({ ...prevState, footerClicked: prevState.footerClicked + 1 })
    })
  }

  getCurrentCity (): ?CityModel {
    const { location, cities } = this.props
    const city = location.payload.city

    return cities && cities.find(_city => _city.code === city)
  }

  renderFeedbackModal = (): React.Node => {
    if (!this.state.feedbackModalRating) {
      return null
    }

    const { cities, location, feedbackTargetInformation } = this.props

    return <FeedbackModal cities={cities}
                          feedbackStatus={this.state.feedbackModalRating}
                          closeFeedbackModal={this.closeFeedbackModal}
                          location={location}
                          {...feedbackTargetInformation} />
  }

  openFeedbackModal = (rating: FeedbackRatingType) => this.setState({ feedbackModalRating: rating })

  closeFeedbackModal = () => this.setState({ feedbackModalRating: null })

  renderToolbar = (): React.Node => {
    const { location, categories } = this.props
    const type = location.type

    if (type === CATEGORIES_ROUTE) {
      return <CategoriesToolbar categories={categories} location={location}
                                openFeedbackModal={this.openFeedbackModal} />
    } else if ([EXTRAS_ROUTE, EVENTS_ROUTE, NEWS_ROUTE, DISCLAIMER_ROUTE, WOHNEN_ROUTE, SPRUNGBRETT_ROUTE].includes(type)) {
      return <LocationToolbar openFeedbackModal={this.openFeedbackModal} />
    } else {
      return null
    }
  }

  render () {
    const { viewportSmall, children, location, darkMode, languageChangePaths, events, news } = this.props
    const type = location.type
    const { city, language } = location.payload

    const cityModel = this.getCurrentCity()

    if (!cityModel) {
      return <Layout header={<GeneralHeader viewportSmall={viewportSmall} />}
                     footer={<GeneralFooter />}>
        {children}
      </Layout>
    }

    return <Layout asideStickyTop={this.state.asideStickyTop}
      header={<LocationHeader isEventsEnabled={cityModel && cityModel.eventsEnabled}
                                           isExtrasEnabled={cityModel && cityModel.extrasEnabled}
                                           isNewsEnabled
                                           isNewsActive={cityModel && (cityModel.newsEnabled || cityModel.tuNewsEnabled)}
                                           languageChangePaths={languageChangePaths}
                                           location={location}
                                           events={events}
                                           news={news}
                                           cityName={cityModel && cityModel.name}
                                           viewportSmall={viewportSmall}
                                           onStickyTopChanged={this.handleStickyTopChanged} />}
                   footer={<LocationFooter onClick={this.handleFooterClicked} city={city} language={language} />}
                   toolbar={this.renderToolbar()}
                   modal={type !== SEARCH_ROUTE && this.renderFeedbackModal()}
                   darkMode={darkMode}>
      {children}
    </Layout>
  }
}

export default LocationLayout
