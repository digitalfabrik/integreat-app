// @flow

import * as React from 'react'
import styled from 'styled-components'
import { withTranslation, type TFunction } from 'react-i18next'
import { createFeedbackEndpoint, SEARCH_FEEDBACK_TYPE } from 'api-client'
import type { LocationState } from 'redux-first-router'
import NothingFoundFeedbackBox from './NothingFoundFeedbackBox'
import { cmsApiBaseUrl } from '../../../modules/app/constants/urls'
import TextButton from '../../../modules/common/components/TextButton'

const FeedbackContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const NothingFound = styled.div`
  margin-top: 30px;
`

type PropsType = {|
  location: LocationState,
  query: string,
  resultsFound: boolean,
  t: TFunction
|}

type StateType = {|
  boxOpenedForQuery: ?string
|}

export class SearchFeedback extends React.Component<PropsType, StateType> {
  state = { boxOpenedForQuery: null }

  handleFeedbackLinkClicked = () => {
    const { location, query } = this.props
    const { city, language } = location.payload
    createFeedbackEndpoint(cmsApiBaseUrl).request({
      feedbackType: SEARCH_FEEDBACK_TYPE,
      isPositiveRating: false,
      comment: '',
      city,
      language,
      query
    })
    this.setState({ boxOpenedForQuery: this.props.query })
  }

  render (): React.Node {
    const { resultsFound, query, location, t } = this.props
    if (!resultsFound || query === this.state.boxOpenedForQuery) {
      return <FeedbackContainer>
        <NothingFound>{t('nothingFound')}</NothingFound>
        <NothingFoundFeedbackBox location={location} query={query} />
      </FeedbackContainer>
    } else {
      return <FeedbackContainer>
        <TextButton onClick={this.handleFeedbackLinkClicked} text={t('informationNotFound')} />
      </FeedbackContainer>
    }
  }
}

export default withTranslation<PropsType>('feedback')(SearchFeedback)
