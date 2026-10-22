import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent, { cardContentClasses } from '@mui/material/CardContent'
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
  padding: 0 0 8px 24px;
`

const Option = styled('li')`
  ${({ theme }) => theme.typography.body1};
`

const HighlightedCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '24px',
  width: 'fit-content',
  backgroundColor: theme.palette.background.accent,
  borderRadius: '16px',
  gap: '12px',
  [theme.breakpoints.down('sm')]: {
    gap: '8px',
  },
}))

const StyledSvg = styled(Svg)`
  align-self: start;
`

const StyledCardContent = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  [`&.${cardContentClasses.root}`]: {
    padding: 0,
  },
})

const StyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.dark,
}))

const StyledButton = styled(Button)`
  width: 100%;
  background-color: ${props => props.theme.palette.background.default};
`

const StyledAlert = styled(Alert)`
  max-width: 512px;
`

type SearchFeedbackProps = {
  hasResults: boolean
  isChatEnabled: boolean
}

const SearchFeedback = ({ hasResults, isChatEnabled }: SearchFeedbackProps): React.ReactElement | null => {
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
  const title = hasResults
    ? t($ => $.feedback.search.informationNotFound)
    : t($ =>
        languageCode === fallbackLanguage
          ? $.feedback.search.noResultsInUserLanguage
          : $.feedback.search.noResultsInUserAndSourceLanguage,
      )

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
          <StyledLink variant='body1' to={navigateToFeedback} highlighted>
            {t($ => $.feedback.give)}
          </StyledLink>
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
          <StyledSvg src={FeedbackHintIcon} width={64} height={64} />
          <StyledCardContent>
            <Typography variant='subtitle2' component='h2'>
              {t($ => $.feedback.search.informationMissing)}
            </Typography>
            <Typography variant='body2' component='h3'>
              {t($ => $.feedback.search.helpToImprove, { appName })}
            </Typography>
            <StyledButton
              onClick={handleSubmit}
              startIcon={<NotificationsNoneIcon />}
              variant='outlined'
              disabled={sendingStatus === 'sending'}>
              {t($ => $.feedback.search.informUs)}
            </StyledButton>
          </StyledCardContent>
        </HighlightedCard>
      )}
    </Stack>
  )
}

export default SearchFeedback
