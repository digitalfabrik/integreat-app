import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { FEEDBACK_QUERY_KEY, RATING_NEGATIVE } from 'shared'
import { config } from 'translations'

import buildConfig from '../constants/buildConfig'
import useQueryParamVisibility from '../hooks/useQueryParamVisibility'
import useRegionContentParams from '../hooks/useRegionContentParams'

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const CenteredContainer = styled('div')`
  text-align: center;
`

const SmallTitle = styled('p')`
  font-weight: 600;
`

const Hint = styled('p')`
  padding-bottom: 16px;
`

type SearchFeedbackProps = {
  noResults: boolean
}

const SearchFeedback = ({ noResults }: SearchFeedbackProps): ReactElement => {
  const { languageCode } = useRegionContentParams()
  const { t } = useTranslation('feedback')
  const { open } = useQueryParamVisibility(FEEDBACK_QUERY_KEY)

  const openFeedback = () => open(RATING_NEGATIVE)

  if (noResults) {
    const fallbackLanguage = config.sourceLanguage

    return (
      <CenteredContainer>
        <SmallTitle>
          {languageCode === fallbackLanguage ? t('noResultsInUserLanguage') : t('noResultsInUserAndSourceLanguage')}
        </SmallTitle>
        <Hint>{t('checkQuery', { appName: buildConfig().appName })}</Hint>
        <SmallTitle>{t('informationMissing')}</SmallTitle>
        <Button onClick={openFeedback} variant='outlined'>
          {t('giveFeedback')}
        </Button>
      </CenteredContainer>
    )
  }

  return (
    <Container>
      <Button onClick={openFeedback}>{t('informationNotFound')}</Button>
    </Container>
  )
}

export default SearchFeedback
