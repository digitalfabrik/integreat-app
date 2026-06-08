import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useSearchParams } from 'react-router'

import {
  CATEGORIES_ROUTE,
  EVENTS_ROUTE,
  FEEDBACK_QUERY_KEY,
  POIS_ROUTE,
  RATING_POSITIVE,
  SendingStatusType,
} from 'shared'
import { createFeedbackEndpoint, FeedbackRouteType } from 'shared/api'

import { cmsApiBaseUrl } from '../constants/urls'
import useQueryParamVisibility from '../hooks/useQueryParamVisibility'
import useRegionContentParams from '../hooks/useRegionContentParams'
import useSearchFeedback from '../hooks/useSearchFeedback'
import { captureError } from '../utils/sentry'
import Feedback from './Feedback'
import Dialog from './base/Dialog'
import Snackbar from './base/Snackbar'

const FeedbackContainer = (): ReactElement | null => {
  const { visible, close } = useQueryParamVisibility(FEEDBACK_QUERY_KEY)
  const [queryParams] = useSearchParams()
  const { t } = useTranslation('feedback')
  const [comment, setComment] = useState<string>('')
  const [contactMail, setContactMail] = useState<string>('')
  const [sendingStatus, setSendingStatus] = useState<SendingStatusType>('idle')
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const { route, regionCode, languageCode } = useRegionContentParams()

  // Extract search from query params if available
  const { pathname } = useLocation()
  const { rating, setRating, searchTerm, setSearchTerm, query } = useSearchFeedback(queryParams)
  const pathParts = pathname.split('/').filter(Boolean)
  const pathAfterLanguage = pathParts.slice(3)
  const slug =
    (route === CATEGORIES_ROUTE || route === EVENTS_ROUTE || route === POIS_ROUTE) && pathAfterLanguage.length > 0
      ? decodeURIComponent(pathAfterLanguage[pathAfterLanguage.length - 1] ?? '')
      : undefined

  const handleSubmit = () => {
    setSendingStatus('sending')

    const request = async () => {
      const feedbackEndpoint = createFeedbackEndpoint(cmsApiBaseUrl)
      await feedbackEndpoint.request({
        routeType: route as FeedbackRouteType,
        region: regionCode,
        language: languageCode,
        comment,
        contactMail,
        query,
        slug,
        searchTerm,
        isPositiveRating: rating === RATING_POSITIVE,
      })

      setSendingStatus('successful')
      setSnackbarOpen(true)
      close()
    }

    request().catch(err => {
      captureError(err)
      setSendingStatus('failed')
      setSnackbarOpen(true)
    })
  }

  return (
    <>
      {visible && (
        <Dialog title={t('headline')} close={close}>
          <Feedback
            language={languageCode}
            onCommentChanged={setComment}
            onContactMailChanged={setContactMail}
            onSubmit={handleSubmit}
            rating={rating}
            comment={comment}
            setRating={setRating}
            contactMail={contactMail}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </Dialog>
      )}
      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        severity={sendingStatus === 'successful' ? 'success' : 'error'}
        message={sendingStatus === 'successful' ? t('thanksMessage') : t('failedSendingFeedback')}
        action={
          <IconButton
            aria-label={t('common:close')}
            color='inherit'
            size='small'
            onClick={() => setSnackbarOpen(false)}>
            <CloseIcon />
          </IconButton>
        }
      />
    </>
  )
}

export default FeedbackContainer
