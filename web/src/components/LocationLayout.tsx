import React, { ReactNode } from 'react'
import Layout from '../components/Layout'
import LocationHeader from './LocationHeader'
import LocationFooter from '../components/LocationFooter'
import { CityModel, SEARCH_ROUTE } from 'api-client'
import FeedbackModal from './FeedbackModal'
import { RouteType } from '../routes'
import { FeedbackRatingType } from './FeedbackToolbarItem'

export type ToolbarPropType = (openFeedbackModal: (rating: FeedbackRatingType) => void) => ReactNode

type PropsType = {
  toolbar?: ToolbarPropType
  viewportSmall: boolean
  children?: ReactNode
  route: RouteType
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

  handleStickyTopChanged = (asideStickyTop: number): void => this.setState({ asideStickyTop })

  renderFeedbackModal = (): React.ReactNode => {
    if (!this.state.feedbackModalRating) {
      return null
    }

    const { cityModel, languageCode, route, feedbackTargetInformation } = this.props
    return (
      <FeedbackModal
        cityCode={cityModel.code}
        language={languageCode}
        routeType={route}
        feedbackRating={this.state.feedbackModalRating}
        closeModal={this.closeFeedbackModal}
        {...feedbackTargetInformation}
      />
    )
  }

  openFeedbackModal = (rating: FeedbackRatingType): void => this.setState({ feedbackModalRating: rating })

  closeFeedbackModal = (): void => this.setState({ feedbackModalRating: null })

  renderToolbar = (): ReactNode => {
    const { toolbar, isLoading } = this.props
    if (toolbar && !isLoading) {
      return toolbar(this.openFeedbackModal)
    }
    return null
  }

  render(): ReactNode {
    const { viewportSmall, children, languageCode, languageChangePaths, isLoading, route } = this.props
    const { pathname, cityModel } = this.props

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
            route={route}
          />
        }
        footer={!isLoading ? <LocationFooter city={cityModel.code} language={languageCode} /> : null}
        modal={route !== SEARCH_ROUTE && this.renderFeedbackModal()}
        toolbar={this.renderToolbar()}>
        {children}
      </Layout>
    )
  }
}

export default LocationLayout
