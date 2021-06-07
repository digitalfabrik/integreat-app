import React, { ReactNode } from 'react'
import Layout from '../components/Layout'
import LocationHeader from './LocationHeader'
import LocationFooter from '../components/LocationFooter'
import { CityModel, SEARCH_ROUTE } from 'api-client'
import FeedbackModal from './FeedbackModal'
import { RouteType } from '../RootSwitcher'

export type FeedbackRatingType = 'up' | 'down'

type PropsType = {
  toolbar?: (openFeedbackModal: (rating: FeedbackRatingType) => void) => ReactNode
  viewportSmall: boolean
  children?: ReactNode
  routeType: RouteType
  feedbackTargetInformation: { path?: string; alias?: string } | null
  languageChangePaths: Array<{ code: string; path: string | null; name: string }> | null
  isLoading: boolean
  cityModel: CityModel
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

  renderFeedbackModal = (): React.ReactNode => {
    if (!this.state.feedbackModalRating) {
      return null
    }

    const { cityModel, languageCode, routeType, feedbackTargetInformation } = this.props
    return (
      <FeedbackModal
        cityCode={cityModel.code}
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
    const { toolbar } = this.props
    if (toolbar) {
      return toolbar(this.openFeedbackModal)
    }
    return null
  }

  render() {
    const { viewportSmall, children, languageCode, languageChangePaths, isLoading } = this.props
    const { pathname, routeType, cityModel } = this.props

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
        footer={!isLoading ? <LocationFooter city={cityModel.code} language={languageCode} /> : null}
        modal={routeType !== SEARCH_ROUTE && this.renderFeedbackModal()}
        toolbar={this.renderToolbar()}>
        {children}
      </Layout>
    )
  }
}

export default LocationLayout
