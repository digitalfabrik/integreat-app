// @flow

import * as React from 'react'
import Layout from '../components/Layout'
import LocationHeader from './LocationHeader'
import LocationFooter from '../components/LocationFooter'
import CategoriesToolbar from '../../../routes/categories/containers/CategoriesToolbar'
import { CategoriesMapModel, CityModel } from 'api-client'
import type { LocationState } from 'redux-first-router'
import FeedbackModal from '../../feedback/components/FeedbackModal'
import LocationToolbar from '../components/LocationToolbar'
import { CATEGORIES_ROUTE } from '../../app/route-configs/CategoriesRouteConfig'
import { EVENTS_ROUTE } from '../../app/route-configs/EventsRouteConfig'
import { LOCAL_NEWS_ROUTE } from '../../app/route-configs/LocalNewsRouteConfig'
import { TUNEWS_ROUTE } from '../../app/route-configs/TunewsRouteConfig'
import { SPRUNGBRETT_ROUTE } from '../../app/route-configs/SprungbrettRouteConfig'
import { WOHNEN_ROUTE } from '../../app/route-configs/WohnenRouteConfig'
import { DISCLAIMER_ROUTE } from '../../app/route-configs/DisclaimerRouteConfig'
import { SEARCH_ROUTE } from '../../app/route-configs/SearchRouteConfig'
import { OFFERS_ROUTE } from '../../app/route-configs/OffersRouteConfig'
import { POIS_ROUTE } from '../../app/route-configs/PoisRouteConfig'
import type { FeedbackTargetInformationType } from '../../app/route-configs/RouteConfig'
import type { LanguageChangePathsType } from '../../app/containers/Switcher'

export type FeedbackRatingType = 'up' | 'down'

type PropsType = {|
  cities: ?Array<CityModel>,
  categories: ?CategoriesMapModel,
  viewportSmall: boolean,
  children?: React.Node,
  location: LocationState,
  toggleDarkMode: () => void,
  darkMode: boolean,
  feedbackTargetInformation: FeedbackTargetInformationType,
  languageChangePaths: ?LanguageChangePathsType,
  isLoading: boolean
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
      return { ...prevState, footerClicked: prevState.footerClicked + 1 }
    })
  }

  getCurrentCity(): ?CityModel {
    const { location, cities } = this.props
    const city = location.payload.city

    return cities && cities.find(_city => _city.code === city)
  }

  renderFeedbackModal = (): React.Node => {
    if (!this.state.feedbackModalRating) {
      return null
    }

    const { location, feedbackTargetInformation } = this.props
    return (
      <FeedbackModal
        feedbackRating={this.state.feedbackModalRating}
        closeFeedbackModal={this.closeFeedbackModal}
        location={location}
        {...feedbackTargetInformation}
      />
    )
  }

  openFeedbackModal = (rating: FeedbackRatingType) => this.setState({ feedbackModalRating: rating })

  closeFeedbackModal = () => this.setState({ feedbackModalRating: null })

  renderToolbar = (): React.Node => {
    const { viewportSmall, location, categories } = this.props
    const type = location.type
    const feedbackRoutes = [
      OFFERS_ROUTE,
      EVENTS_ROUTE,
      LOCAL_NEWS_ROUTE,
      TUNEWS_ROUTE,
      DISCLAIMER_ROUTE,
      WOHNEN_ROUTE,
      SPRUNGBRETT_ROUTE,
      POIS_ROUTE
    ]
    if (type === CATEGORIES_ROUTE) {
      return (
        <CategoriesToolbar
          categories={categories}
          location={location}
          openFeedbackModal={this.openFeedbackModal}
          viewportSmall={viewportSmall}
        />
      )
    } else if (feedbackRoutes.includes(type)) {
      return <LocationToolbar openFeedbackModal={this.openFeedbackModal} viewportSmall={viewportSmall} />
    } else {
      return null
    }
  }

  render() {
    const { viewportSmall, children, location, darkMode, languageChangePaths, isLoading } = this.props
    const type = location.type
    const { city, language } = location.payload

    const cityModel = this.getCurrentCity()

    if (!cityModel) {
      return null
    }

    return (
      <Layout
        asideStickyTop={this.state.asideStickyTop}
        header={
          <LocationHeader
            cityModel={cityModel}
            languageChangePaths={languageChangePaths}
            location={location}
            viewportSmall={viewportSmall}
            onStickyTopChanged={this.handleStickyTopChanged}
          />
        }
        footer={
          !isLoading ? <LocationFooter onClick={this.handleFooterClicked} city={city} language={language} /> : null
        }
        toolbar={this.renderToolbar()}
        modal={type !== SEARCH_ROUTE && this.renderFeedbackModal()}
        darkMode={darkMode}>
        {children}
      </Layout>
    )
  }
}

export default LocationLayout
