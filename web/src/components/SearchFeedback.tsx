import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import React, { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'

import {
  FEEDBACK_QUERY_KEY,
  getChatName,
  SendingStatusType,
  SEARCH_ROUTE,
  RATING_NEGATIVE,
  parseQueryParams,
  toQueryParams,
} from 'shared'
import { createFeedbackEndpoint } from 'shared/api'
import { config } from 'translations'

import { FeedbackHintIcon } from '../assets'
import buildConfig from '../constants/buildConfig'
import { cmsApiBaseUrl } from '../constants/urls'
import useRegionContentParams from '../hooks/useRegionContentParams'
import { captureError } from '../utils/sentry'
import Link from './base/Link'
import Svg from './base/Svg'

const MuiContainer = styled(Container)<{ centered?: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: ${props => (props.centered ? 'center' : 'flex-start')};
`

const Wrapper = styled(Box)(({ theme }) => ({
  width: '70%',
  gap: 2,
  display: 'flex',
  flexDirection: 'column',

  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}))

const Options = styled('ul')`
  display: flex;
  flex-direction: column;
`

const Option = styled('li')`
  ${({ theme }) => theme.typography.body1};
`

const HighlightedCard = styled(Card)(({ theme }) => ({
  padding: '12px',
  width: '80%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: theme.palette.background.accent,

  [theme.breakpoints.down('md')]: {
    width: '100%',
    alignSelf: 'center',
  },
}))

const StyledButton = styled(Button)`
  width: 100%;
  background-color: ${props => props.theme.palette.background.default};
`

const StyledAlert = styled(Alert)`
  width: 80%;
  display: flex;
  padding: 12px;
  background-color: ${props => props.theme.palette.success.light};
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

    request().catch(err => {
      captureError(err)
      setSendingStatus('failed')
    })
  }

  const fallbackLanguage = config.sourceLanguage
  const isNoResults = noResults
    ? t($ =>
        languageCode === fallbackLanguage
          ? $.feedback.search.noResultsInUserLanguage
          : $.feedback.search.noResultsInUserAndSourceLanguage,
      )
    : t($ => $.feedback.search.informationNotFound)

  return (
    <MuiContainer centered={noResults}>
      <Wrapper>
        <Typography variant='subtitle1' component='h1' gutterBottom>
          {isNoResults}
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
          <StyledAlert severity='success' onClose={() => setDismissed(true)}>
            <AlertTitle>{t($ => $.feedback.thanks.title)}</AlertTitle>
            <Typography component='p'>{t($ => $.feedback.thanks.description)}</Typography>
            {isChatEnabled && (
              <Typography>
                <Trans
                  ns='feedback'
                  i18nKey={$ => $.feedback.thanks.chatReferral}
                  components={{ Link: <Link to={navigateToFeedback} highlighted /> }}
                />
              </Typography>
            )}
          </StyledAlert>
        )}
        {sendingStatus === 'failed' && !dismissed && (
          <StyledAlert severity='error' onClose={() => setDismissed(true)}>
            <AlertTitle>{t($ => $.error.title)}</AlertTitle>
            <Typography>{t($ => $.error.unknownError)}</Typography>
          </StyledAlert>
        )}
        {!submitted && (
          <HighlightedCard>
            <Box sx={{ alignSelf: 'start' }}>
              <Svg src={FeedbackHintIcon} width={64} height={64} />
            </Box>
            <CardContent>
              <Typography variant='subtitle1' component='h2'>
                {t($ => $.feedback.search.informationMissing)}
              </Typography>
              <Typography variant='body1' component='p'>
                {t($ => $.feedback.search.helpToImprove, { appName: buildConfig().appName })}
              </Typography>
              <CardActions>
                <StyledButton onClick={handleSubmit} startIcon={<NotificationsNoneIcon />} variant='outlined'>
                  {t($ => $.feedback.search.informUs)}
                </StyledButton>
              </CardActions>
            </CardContent>
          </HighlightedCard>
        )}
      </Wrapper>
    </MuiContainer>
  )
}

export default SearchFeedback
