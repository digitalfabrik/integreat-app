import React, { ReactNode } from 'react'
import Layout from '../components/Layout'
import LocationHeader from './LocationHeader'
import LocationFooter from '../components/LocationFooter'
import { CategoriesMapModel, CityModel } from 'api-client'
import FeedbackModal from './FeedbackModal'
import { RouteType } from '../routes/App'

export type FeedbackRatingType = 'up' | 'down'

type PropsType = {
  cities: Array<CityModel> | null
  categories: CategoriesMapModel | null
  viewportSmall: boolean
  children?: ReactNode
  routeType: RouteType
  feedbackTargetInformation: { path?: string; alias?: string } | null
  languageChangePaths: Array<{ code: string; path: string | null; name: string }> | null
  isLoading: boolean
  cityCode: string
  languageCode: string
  pathname: string
}

type LocalStateType = {
  asideStickyTop: number
  feedbackModalRating: FeedbackRatingType | null
}

export class LocationLayout extends React.Component<PropsType, LocalStateType> {
  constructor(props: PropsType) {
    super(props)
    this.state = { asideStickyTop: 0, feedbackModalRating: null }
  }

  handleStickyTopChanged = (asideStickyTop: number) => this.setState({ asideStickyTop })

  getCurrentCity(): CityModel | null {
    const { cityCode, cities } = this.props
    return cities?.find(_city => _city.code === cityCode) ?? null
  }

  renderFeedbackModal = (): React.ReactNode => {
    if (!this.state.feedbackModalRating) {
      return null
    }

    const { cityCode, languageCode, routeType, feedbackTargetInformation } = this.props
    return (
      <FeedbackModal
        cityCode={cityCode}
        language={languageCode}
        routeType={routeType}
        feedbackRating={this.state.feedbackModalRating}
        closeFeedbackModal={this.closeFeedbackModal}
        {...feedbackTargetInformation}
      />
    )
  }

  openFeedbackModal = (rating: FeedbackRatingType) => this.setState({ feedbackModalRating: rating })

  closeFeedbackModal = () => this.setState({ feedbackModalRating: null })

  renderToolbar = (): ReactNode => {
    // TODO Check right routes
    // const { viewportSmall, categories } = this.props
    // const type = location.type
    // const feedbackRoutes = [
    //   OFFERS_ROUTE,
    //   EVENTS_ROUTE,
    //   LOCAL_NEWS_ROUTE,
    //   TUNEWS_ROUTE,
    //   DISCLAIMER_ROUTE,
    //   WOHNEN_ROUTE,
    //   SPRUNGBRETT_ROUTE,
    //   POIS_ROUTE
    // ]
    // if (type === CATEGORIES_ROUTE) {
    //   return (
    //     <CategoriesToolbar
    //       categories={categories}
    //       location={location}
    //       openFeedbackModal={this.openFeedbackModal}
    //       viewportSmall={viewportSmall}
    //     />
    //   )
    // } else if (feedbackRoutes.includes(type)) {
    //   return <LocationToolbar openFeedbackModal={this.openFeedbackModal} viewportSmall={viewportSmall} />
    // } else {
    //   return null
    // }
    return null
  }

  render() {
    const { viewportSmall, children, cityCode, languageCode, languageChangePaths, isLoading } = this.props
    const { pathname } = this.props

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
            viewportSmall={viewportSmall}
            onStickyTopChanged={this.handleStickyTopChanged}
            languageCode={languageCode}
            pathname={pathname}
          />
        }
        footer={!isLoading ? <LocationFooter city={cityCode} language={languageCode} /> : null}
        // TODO right check
        // modal={type !== SEARCH_ROUTE && this.renderFeedbackModal()}
        toolbar={this.renderToolbar()}>
        {children}
      </Layout>
    )
  }
}

export default LocationLayout
