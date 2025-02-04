import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { SEARCH_ROUTE } from 'shared'

import FeedbackContainer from './FeedbackContainer'
import TextButton from './base/TextButton'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

type SearchFeedbackProps = {
  cityCode: string
  languageCode: string
  query: string
  noResults: boolean
}

const SearchFeedback = ({ cityCode, languageCode, query, noResults }: SearchFeedbackProps): ReactElement => {
  const [showFeedback, setShowFeedback] = useState<boolean>(false)
  const { t } = useTranslation('feedback')

  useEffect(() => setShowFeedback(false), [query])

  if (noResults || showFeedback) {
    return (
      <Container>
        <FeedbackContainer
          cityCode={cityCode}
          language={languageCode}
          routeType={SEARCH_ROUTE}
          query={query}
          noResults={noResults}
          initialRating={null}
        />
      </Container>
    )
  }

  return (
    <Container>
      <TextButton onClick={() => setShowFeedback(true)} text={t('informationNotFound')} />
    </Container>
  )
}

export default SearchFeedback
