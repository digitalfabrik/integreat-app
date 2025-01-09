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

const SemiBoldText = styled.p`
  font-weight: 600;
`

const MiddleText = styled.p`
  padding-bottom: 1rem;
`

const StyledButton = styled(TextButton)`
  margin-top: 0.5rem;
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
          isPositiveRating={null}
        />
      </Container>
    )
  }

  if (noResults) {
    const getLanguageTranslationFromCode = (code: string): string =>
      new Intl.DisplayNames(languageCode, { type: 'language' }).of(code) ?? code

    const fallbackLanguage = config.sourceLanguage

    return (
      <CenteredContainer>
        <SemiBoldText>
          {languageCode === fallbackLanguage
            ? t('noResultsInOneLanguage', { contentLanguage: getLanguageTranslationFromCode(languageCode) })
            : t('noResultsInTwoLanguages', {
                contentLanguage: getLanguageTranslationFromCode(languageCode),
                fallbackLanguage: getLanguageTranslationFromCode(fallbackLanguage),
              })}
        </SemiBoldText>
        <MiddleText>{t('checkQuery', { appName: buildConfig().appName })}</MiddleText>
        <SemiBoldText>{t('informationMissing')}</SemiBoldText>
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
