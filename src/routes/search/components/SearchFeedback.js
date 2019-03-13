// @flow

import * as React from 'react'
import styled from 'styled-components'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import { feedbackEndpoint, SEARCH_FEEDBACK_TYPE, CityModel } from '@integreat-app/integreat-api-client'
import type { LocationState } from 'redux-first-router'
import NothingFoundFeedbackBox from './NothingFoundFeedbackBox'

const FeedbackButton = styled.div`
  padding: 30px 0;
  text-align: center;
`

const FeedbackLink = styled.span`
  padding: 5px 20px;
  background-color: ${props => props.theme.colors.themeColor};
  color: ${props => props.theme.colors.textColor};
  border-radius: 0.25em;
`

const FeedbackContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const NothingFound = styled.div`
  margin-top: 30px;
`

type PropsType = {|
  cities: Array<CityModel>,
  location: LocationState,
  query: string,
  resultsFound: boolean,
  t: TFunction
|}

type StateType = {|
  boxOpenedForQuery: ?string
|}

export class SearchFeedback extends React.Component<PropsType, StateType> {
  state = {boxOpenedForQuery: null}

  openFeedbackBox = () => {
    const {location, query} = this.props
    const {city, language} = location.payload
    feedbackEndpoint.request({
      feedbackType: SEARCH_FEEDBACK_TYPE,
      isPositiveRating: false,
      comment: '',
      city,
      language,
      query
    })
    this.setState({boxOpenedForQuery: this.props.query})
  }

  render (): React.Node {
    const {resultsFound, query, location, t} = this.props
    if (!resultsFound || query === this.state.boxOpenedForQuery) {
      return <FeedbackContainer>
        <NothingFound>{t('nothingFound')}</NothingFound>
        <NothingFoundFeedbackBox location={location} query={query} />
      </FeedbackContainer>
    } else {
      return <FeedbackButton>
        <FeedbackLink onClick={this.openFeedbackBox}>{t('informationNotFound')}</FeedbackLink>
      </FeedbackButton>
    }
  }
}

export default withTranslation('feedback')(SearchFeedback)
