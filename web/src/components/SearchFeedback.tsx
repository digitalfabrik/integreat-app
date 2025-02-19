import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { SEARCH_ROUTE } from 'shared'
import { config } from 'translations'

import buildConfig from '../constants/buildConfig'
import FeedbackContainer from './FeedbackContainer'
import TextButton from './base/TextButton'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const CenteredContainer = styled.div`
  text-align: center;
`

const SmallTitle = styled.p`
  font-weight: 600;
`

const Hint = styled.p`
  padding-bottom: 16px;
`

const StyledButton = styled(TextButton)`
  margin-top: 8px;
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

  if (showFeedback) {
    return (
      <Container>
        <FeedbackContainer
          cityCode={cityCode}
          language={languageCode}
          routeType={SEARCH_ROUTE}
          query={query}
          initialRating={null}
          noResults={noResults}
        />
      </Container>
    )
  }

  if (noResults) {
    const fallbackLanguage = config.sourceLanguage

    return (
      <CenteredContainer>
        <SmallTitle>
          {languageCode === fallbackLanguage ? t('noResultsInUserLanguage') : t('noResultsInUserAndSourceLanguage')}
        </SmallTitle>
        <Hint>{t('checkQuery', { appName: buildConfig().appName })}</Hint>
        <SmallTitle>{t('informationMissing')}</SmallTitle>
        <StyledButton type='button' text={t('giveFeedback')} onClick={() => setShowFeedback(true)} />
      </CenteredContainer>
    )
  }

  return (
    <Container>
      <TextButton onClick={() => setShowFeedback(true)} text={t('informationNotFound')} />
    </Container>
  )
}

export default SearchFeedback
