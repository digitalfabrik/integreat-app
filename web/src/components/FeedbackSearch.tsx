// tbd
import React, { ReactElement, useState } from 'react'
import styled from 'styled-components'
import { SEARCH_FEEDBACK_TYPE } from 'api-client'
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

const CommentField = styled.textarea`
  resize: none;
`
const RequiredText = styled.span`
  color: red;
  font-size: 1.5em;
`

type PropsType = {
  cityCode: string
  languageCode: string
  query: string
  resultsFound: boolean
}

const FeedbackSearch = ({ cityCode, languageCode, query, resultsFound }: PropsType): ReactElement => {
  const [boxOpenedForQuery, setBoxOpenedForQuery] = useState<string | null>(null)
  const { t } = useTranslation('feedback')

  const handleFeedbackLinkClicked = (): void => {
    setBoxOpenedForQuery(query)
  }

  if (!resultsFound || query === boxOpenedForQuery) {
    return (
      <FeedbackContainer1>
        <NothingFound>{t('nothingFound')}</NothingFound>
        <FeedbackContainer cityCode={cityCode} language={languageCode} routeType={SEARCH_FEEDBACK_TYPE}
                           isPositiveFeedback={false} isSearchFeedback query={query} />
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

export default FeedbackSearch
