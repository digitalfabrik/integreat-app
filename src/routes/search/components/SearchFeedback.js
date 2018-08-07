// @flow

import * as React from 'react'
import type { Node } from 'react'
import FeedbackModal from '../../feedback/components/FeedbackModal'
import styled from 'styled-components'
import CleanLink from '../../../modules/common/components/CleanLink'
import FeedbackBox from '../../feedback/components/FeedbackBox'
import { NEGATIVE_RATING, POSITIVE_RATING } from '../../../modules/endpoint/FeedbackEndpoint'
import { translate } from 'react-i18next'
import type { TFunction } from 'react-i18next'
import CityModel from '../../../modules/endpoint/models/CityModel'
import type { LocationState } from 'redux-first-router'
import { goToFeedback } from '../../../modules/app/routes/feedback'

const FeedbackButton = styled.div`
  padding: 30px 0;
  text-align: center;
`

const FeedbackLink = styled(CleanLink)`
  padding: 5px 20px;
  background-color: ${props => props.theme.colors.themeColor};
  color: ${props => props.theme.colors.backgroundAccentColor};
  border-radius: 0.25em;
`

const FeedbackContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

type PropsType = {
  cities: Array<CityModel>,
  location: LocationState,
  query: string,
  resultsFound: boolean,
  t: TFunction
}

export class SearchFeedback extends React.Component<PropsType> {
  renderFeedbackModal (): Node {
    const {t, cities, location, query} = this.props
    const feedbackType = location.query && location.query.feedback

    return (
      <React.Fragment>
        {query && (
          <FeedbackButton>
            <FeedbackLink to={goToFeedback(location, NEGATIVE_RATING)}>
              {t('informationNotFound')}
              </FeedbackLink>
          </FeedbackButton>
        )}
        <FeedbackModal
          query={query}
          cities={cities}
          location={location}
          isPositiveRatingSelected={feedbackType === POSITIVE_RATING}
          isOpen={!!feedbackType}
          commentMessageOverride={t('wantedInformation')} />
      </React.Fragment>
    )
  }

  renderFeedbackBox (): Node {
    const {t, cities, location, query} = this.props
    const feedbackType = location.query && location.query.feedback

    return (
      <FeedbackContainer>
        <div>{t('nothingFound')}</div>
        <FeedbackBox
          query={query}
          cities={cities}
          location={location}
          isPositiveRatingSelected={false}
          isOpen={!!feedbackType}
          commentMessageOverride={t('wantedInformation')}
          hideHeader />
      </FeedbackContainer>
    )
  }

  render () {
    const {resultsFound} = this.props

    if (resultsFound) {
      return this.renderFeedbackModal()
    } else {
      return this.renderFeedbackBox()
    }
  }
}

export default translate('feedback')(SearchFeedback)
