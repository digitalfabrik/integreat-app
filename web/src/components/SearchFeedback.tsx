import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { SEARCH_ROUTE } from 'shared'
import { config } from 'translations'

import buildConfig from '../constants/buildConfig'
import useCityContentParams from '../hooks/useCityContentParams'
import FeedbackContainer from './FeedbackContainer'

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const CenteredContainer = styled('div')`
  text-align: center;
`

type SearchFeedbackProps = {
  query: string
  noResults: boolean
}

const SearchFeedback = ({ query, noResults }: SearchFeedbackProps): ReactElement => {
  const [showFeedback, setShowFeedback] = useState<boolean>(false)
  const { languageCode } = useCityContentParams()
  const { t } = useTranslation('feedback')

  useEffect(() => setShowFeedback(false), [query])

  if (showFeedback) {
    return (
      <Container>
        <FeedbackContainer query={query} initialRating={null} noResults={noResults} />
      </Container>
    )
  }

  if (noResults) {
    const fallbackLanguage = config.sourceLanguage

    return (
      <CenteredContainer>
        <Typography variant='title2'>
          {languageCode === fallbackLanguage ? t('noResultsInUserLanguage') : t('noResultsInUserAndSourceLanguage')}
        </Typography>
        <Typography variant='body1'>{t('checkQuery', { appName: buildConfig().appName })}</Typography>
        <Typography variant='title2' component='p'>
          {t('informationMissing')}
        </Typography>
        <Button onClick={() => setShowFeedback(true)} variant='outlined'>
          {t('giveFeedback')}
        </Button>
      </CenteredContainer>
    )
  }

  return (
    <Container>
      <Button onClick={() => setShowFeedback(true)}>{t('informationNotFound')}</Button>
    </Container>
  )
}

export default SearchFeedback
