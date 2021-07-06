// tbd
import React, { ReactElement, useState } from 'react'
import styled from 'styled-components'
import { createFeedbackEndpoint, SEARCH_FEEDBACK_TYPE } from 'api-client'
import NothingFoundFeedbackBox from './NothingFoundFeedbackBox'
import { cmsApiBaseUrl } from '../constants/urls'
import TextButton from './TextButton'
import { useTranslation } from 'react-i18next'
import FeedbackContainer from './FeedbackContainer'

const FeedbackContainer1 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const NothingFound = styled.div`
  margin-top: 30px;
`

type PropsType = {
  cityCode: string
  languageCode: string
  query: string
  resultsFound: boolean
}

const SearchFeedback = ({ cityCode, languageCode, query, resultsFound }: PropsType): ReactElement => {
  const [boxOpenedForQuery, setBoxOpenedForQuery] = useState<string | null>(null)
  const { t } = useTranslation('feedback')

  const handleFeedbackLinkClicked = (): void => {
    createFeedbackEndpoint(cmsApiBaseUrl).request({
      feedbackType: SEARCH_FEEDBACK_TYPE,
      isPositiveRating: false,
      comment: '',
      city: cityCode,
      language: languageCode,
      query
    })
    setBoxOpenedForQuery(query)
  }
  
  return <FeedbackContainer cityCode={} language={} routeType={} isPositiveFeedback={} closeFeedbackModal={} sendingStatus={} onSubmit={}

                            if (!resultsFound || query === boxOpenedForQuery) {
    return (
      <FeedbackContainer1>
        <NothingFound>{t('nothingFound')}</NothingFound>
        <NothingFoundFeedbackBox cityCode={cityCode} languageCode={languageCode} query={query} />
      </FeedbackContainer1>
    )
  } else {
    return (
      <FeedbackContainer1>
        <TextButton onClick={handleFeedbackLinkClicked} text={t('informationNotFound')} />
      </FeedbackContainer1>
    )
  }
}

export default SearchFeedback
