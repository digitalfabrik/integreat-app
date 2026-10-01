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
import React, { ReactElement, useRef, useState } from 'react'
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
import { createFeedbackEndpoint, createRegionEndpoint, FeedbackType } from 'shared/api'
import { config } from 'translations'

import { FeedbackHintIcon } from '../assets'
import buildConfig from '../constants/buildConfig'
import { cmsApiBaseUrl } from '../constants/urls'
import useQueryFromEndpoint from '../hooks/useQueryFromEndpoint'
import useQueryParam from '../hooks/useQueryParam'
import useRegionContentParams from '../hooks/useRegionContentParams'
import { captureError } from '../utils/sentry'
import Link from './base/Link'
import Svg from './base/Svg'

const MuiContainer = styled(Container)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Wrapper = styled(Box)(({ theme }) => ({
  width: '70%',
  gap: 2,

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
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: theme.palette.background.accent,

  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}))

const StyledButton = styled(Button)`
  width: 100%;
  background-color: ${props => props.theme.palette.background.default};
`

const StyledAlert = styled(Alert)`
  position: absolute;
  inset: 0;
  display: flex;
  padding: 12px;
`

type SearchFeedbackProps = {
  noResults: boolean
}

const SearchFeedback = ({ noResults }: SearchFeedbackProps): ReactElement => {
  const { contentDirection } = useTheme()
  const { regionCode, languageCode } = useRegionContentParams()
  const { data: region } = useQueryFromEndpoint(createRegionEndpoint, cmsApiBaseUrl, {
    region: regionCode,
  })
  const [_, setFeedbackQueryParam] = useQueryParam(FEEDBACK_QUERY_KEY)
  const { t } = useTranslation()
  const { appName } = buildConfig()
  const [queryParams] = useSearchParams()
  const { searchText } = parseQueryParams(queryParams)
  const cardRef = useRef<HTMLDivElement>(null)

  const [sendingStatus, setSendingStatus] = useState<SendingStatusType>('idle')
  const [alertStatusOpen, setAlertStatusOpen] = useState(false)
  const isChatEnabled = buildConfig().featureFlags.chat && region?.chatEnabled
  const openFeedback = () => setFeedbackQueryParam(RATING_NEGATIVE)

  const goToChat = `?${toQueryParams({ chat: true })}`

  const goToFeedback = `?${toQueryParams({ feedback: RATING_NEGATIVE })}`

  const handleSubmit = () => {
    setSendingStatus('sending')

    const request = async () => {
      const feedbackEndpoint = createFeedbackEndpoint(cmsApiBaseUrl)
      await feedbackEndpoint.request({
        routeType: SEARCH_ROUTE as FeedbackType,
        region: regionCode,
        language: languageCode,
        comment: '',
        contactMail: '',
        searchTerm: searchText,
        rating: RATING_NEGATIVE,
      })

      setSendingStatus('successful')
      setAlertStatusOpen(true)
    }

    request().catch(err => {
      captureError(err)
      setSendingStatus('failed')
      setAlertStatusOpen(true)
    })
  }

  if (noResults) {
    const fallbackLanguage = config.sourceLanguage

    return (
      <MuiContainer>
        <Wrapper>
          <Typography variant='subtitle1' component='h1' gutterBottom>
            {languageCode === fallbackLanguage
              ? t($ => $.feedback.search.noResultsInUserLanguage)
              : t($ => $.feedback.search.noResultsInUserAndSourceLanguage)}
          </Typography>
          <Typography variant='subtitle2' component='h2' dir={contentDirection}>
            {t($ => $.feedback.search.tryOptions)}
          </Typography>
          <Options>
            <Option>{t($ => $.feedback.search.options.useSearchTerm)}</Option>
            <Option>{t($ => $.feedback.search.options.useShortWord)}</Option>
            {isChatEnabled && (
              <Option>
                <Trans
                  ns='feedback'
                  i18nKey={$ => $.feedback.search.options.askChat}
                  values={{ name: getChatName(appName) }}
                  components={{ Link: <Link to={goToChat} highlighted /> }}
                />
              </Option>
            )}
          </Options>
          <HighlightedCard ref={cardRef}>
            <Box sx={{ alignSelf: 'start' }}>
              <Svg src={FeedbackHintIcon} width={63} height={60} />
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

            {alertStatusOpen && (
              <StyledAlert
                severity={sendingStatus === 'successful' ? 'success' : 'error'}
                onClose={() => setAlertStatusOpen(false)}
                sx={{}}>
                <AlertTitle>
                  {sendingStatus === 'successful' ? t($ => $.feedback.thanks.title) : t($ => $.error.title)}
                </AlertTitle>
                <Typography>
                  {sendingStatus === 'successful'
                    ? t($ => $.feedback.thanks.description)
                    : t($ => $.error.unknownError)}
                </Typography>
                {isChatEnabled && sendingStatus === 'successful' && (
                  <Typography>
                    <Trans
                      ns='feedback'
                      i18nKey={$ => $.feedback.thanks.chatReferral}
                      components={{ Link: <Link to={goToFeedback} highlighted /> }}
                    />
                  </Typography>
                )}
              </StyledAlert>
            )}
          </HighlightedCard>
        </Wrapper>
      </MuiContainer>
    )
  }

  return (
    <MuiContainer>
      <Button onClick={openFeedback}>{t($ => $.feedback.search.informationNotFound)}</Button>
    </MuiContainer>
  )
}

export default SearchFeedback
