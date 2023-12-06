import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { SEARCH_ROUTE } from 'api-client'

import FeedbackContainer from './FeedbackContainer'
import TextButton from './base/TextButton'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

type FeedbackSearchProps = {
  cityCode: string
  languageCode: string
  query: string
  resultsFound: boolean
}

const FeedbackSearch = ({ cityCode, languageCode, query, resultsFound }: FeedbackSearchProps): ReactElement => {
  const [boxOpenedForQuery, setBoxOpenedForQuery] = useState<string | null>(null)
  const { t } = useTranslation('feedback')

  const handleFeedbackLinkClicked = (): void => {
    setBoxOpenedForQuery(query)
  }

  if (!resultsFound || query === boxOpenedForQuery) {
    return (
      <Container>
        <FeedbackContainer cityCode={cityCode} language={languageCode} routeType={SEARCH_ROUTE} query={query} />
      </Container>
    )
  }
  return (
    <Container>
      <TextButton onClick={handleFeedbackLinkClicked} text={t('informationNotFound')} />
    </Container>
  )
}

export default FeedbackSearch
