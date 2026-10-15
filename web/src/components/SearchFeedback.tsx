import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import React, { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'

import { getChatName, SendingStatusType, SEARCH_ROUTE, RATING_NEGATIVE, parseQueryParams, toQueryParams } from 'shared'
import { createFeedbackEndpoint } from 'shared/api'
import { config } from 'translations'

import { FeedbackHintIcon } from '../assets'
import buildConfig from '../constants/buildConfig'
import { cmsApiBaseUrl } from '../constants/urls'
import useRegionContentParams from '../hooks/useRegionContentParams'
import { captureError } from '../utils/sentry'
import Link from './base/Link'
import Svg from './base/Svg'

const Options = styled('ul')`
  display: flex;
  flex-direction: column;
  padding-left: 24px;
`

const Option = styled('li')`
  ${({ theme }) => theme.typography.body1};
`

const HighlightedCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: '12px',
  maxWidth: '512px',
  backgroundColor: theme.palette.background.accent,
}))

const StyledButton = styled(Button)`
  width: 100%;
  background-color: ${props => props.theme.palette.background.default};
  margin-top: 6px;
`

const StyledAlert = styled(Alert)`
  max-width: 512px;
  display: flex;
  background-color: ${props => props.theme.palette.success.light};
  color: ${props => props.theme.palette.success.contrastText};
`

type SearchFeedbackProps = {
  noResults: boolean
  isChatEnabled: boolean
}

const SearchFeedback = ({ noResults, isChatEnabled }: SearchFeedbackProps): React.ReactElement | null => {
  const { contentDirection } = useTheme()
  const { regionCode, languageCode } = useRegionContentParams()
  const { t } = useTranslation()
  const { appName } = buildConfig()
  const [queryParams] = useSearchParams()
  const { searchText } = parseQueryParams(queryParams)
  const [dismissed, setDismissed] = useState(false)

  const [sendingStatus, setSendingStatus] = useState<SendingStatusType>('idle')
  const submitted = sendingStatus === 'successful' || sendingStatus === 'failed'

  const navigateToChat = `?${toQueryParams({ chat: true })}`

  const navigateToFeedback = `?${toQueryParams({ feedback: RATING_NEGATIVE })}`

  const handleSubmit = () => {
    setSendingStatus('sending')

    const request = async () => {
      const feedbackEndpoint = createFeedbackEndpoint(cmsApiBaseUrl)
      await feedbackEndpoint.request({
        routeType: SEARCH_ROUTE,
        region: regionCode,
        language: languageCode,
        comment: '',
        contactMail: '',
        searchTerm: searchText,
        rating: RATING_NEGATIVE,
      })

      setSendingStatus('successful')
    }

    request().catch(error => {
      captureError(error)
      setSendingStatus('failed')
    })
  }

  const fallbackLanguage = config.sourceLanguage
  const title = noResults
    ? t($ =>
        languageCode === fallbackLanguage
          ? $.feedback.search.noResultsInUserLanguage
          : $.feedback.search.noResultsInUserAndSourceLanguage,
      )
    : t($ => $.feedback.search.informationNotFound)

  return (
    <Stack>
      <Typography variant='subtitle1' component='h1' gutterBottom>
        {title}
      </Typography>
      <Typography variant='subtitle2' component='h2' dir={contentDirection}>
        {t($ => $.feedback.search.tryOptions)}
      </Typography>
      <Options>
        <Option>{t($ => $.feedback.search.options.useSearchTerm)}</Option>
        <Option>{t($ => $.feedback.search.options.useSingleWord)}</Option>
        {isChatEnabled && (
          <Option>
            <Trans
              ns='feedback'
              i18nKey={$ => $.feedback.search.options.askChat}
              values={{ name: getChatName(appName) }}
              components={{ Link: <Link to={navigateToChat} highlighted /> }}
            />
          </Option>
        )}
      </Options>
      {sendingStatus === 'successful' && !dismissed && (
        <StyledAlert
          severity='success'
          onClose={() => setDismissed(true)}
          iconMapping={{ success: <CheckCircleOutlineIcon /> }}>
          <AlertTitle>{t($ => $.feedback.thanks.title)}</AlertTitle>
          <Typography component='p'>{t($ => $.feedback.thanks.description)}</Typography>
          <Typography component='p' dir={contentDirection}>
            {t($ => $.feedback.thanks.addDetails)}
          </Typography>
          <Link variant='body1' to={navigateToFeedback} highlighted>
            {t($ => $.feedback.give)}
          </Link>
        </StyledAlert>
      )}
      {sendingStatus === 'failed' && !dismissed && (
        <StyledAlert severity='error' onClose={() => setSendingStatus('idle')}>
          <AlertTitle>{t($ => $.error.title)}</AlertTitle>
          <Typography>{t($ => $.error.unknownError)}</Typography>
        </StyledAlert>
      )}
      {!submitted && (
        <HighlightedCard>
          <Svg src={FeedbackHintIcon} width={64} height={64} />
          <CardContent>
            <Typography variant='subtitle1' component='h2'>
              {t($ => $.feedback.search.informationMissing)}
            </Typography>
            <Typography variant='body1' component='p'>
              {t($ => $.feedback.search.helpToImprove, { appName: buildConfig().appName })}
            </Typography>
            <StyledButton onClick={handleSubmit} startIcon={<NotificationsNoneIcon />} variant='outlined'>
              {t($ => $.feedback.search.informUs)}
            </StyledButton>
          </CardContent>
        </HighlightedCard>
      )}
    </Stack>
  )
}

export default SearchFeedback
