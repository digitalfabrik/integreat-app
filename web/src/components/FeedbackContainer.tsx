import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'

import { FEEDBACK_QUERY_KEY, parseQueryParams, Rating, SEARCH_ROUTE, SendingStatusType } from 'shared'
import { createFeedbackEndpoint, FeedbackRouteType } from 'shared/api'

import { cmsApiBaseUrl } from '../constants/urls'
import useQueryParam from '../hooks/useQueryParam'
import useRegionContentParams from '../hooks/useRegionContentParams'
import { captureError } from '../utils/sentry'
import Feedback from './Feedback'
import Dialog from './base/Dialog'
import Snackbar from './base/Snackbar'

type FeedbackContainerProps = {
  slug: string | null
}

const FeedbackContainer = ({ slug }: FeedbackContainerProps): ReactElement | null => {
  const [feedbackQueryParam, setFeedbackQueryParam] = useQueryParam(FEEDBACK_QUERY_KEY)
  const [queryParams] = useSearchParams()
  const { t } = useTranslation()
  const { route, regionCode, languageCode } = useRegionContentParams()
  const { searchText } = parseQueryParams(queryParams)
  const query = route === SEARCH_ROUTE ? searchText : undefined
  const rating = typeof feedbackQueryParam === 'string' ? feedbackQueryParam : null

  const [comment, setComment] = useState<string>('')
  const [contactMail, setContactMail] = useState<string>('')
  const [sendingStatus, setSendingStatus] = useState<SendingStatusType>('idle')
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState<string | undefined>(query)

  const setRating = (newRating: Rating | null) => setFeedbackQueryParam(newRating ?? true)

  useEffect(() => {
    setSearchTerm(query)
  }, [query])

  const closeAndReset = () => {
    setFeedbackQueryParam(undefined)
    setComment('')
    setContactMail('')
    setSearchTerm(query)
  }

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
        slug: slug ?? undefined,
        searchTerm,
        rating,
      })

      setSendingStatus('successful')
      setSnackbarOpen(true)
      closeAndReset()
    }

    request().catch(err => {
      captureError(err)
      setSendingStatus('failed')
      setSnackbarOpen(true)
    })
  }

  return (
    <>
      {feedbackQueryParam !== undefined && (
        <Dialog title={t($ => $.feedback.headline)} close={closeAndReset}>
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
        message={
          sendingStatus === 'successful' ? t($ => $.feedback.thanksMessage) : t($ => $.feedback.failedSendingFeedback)
        }
        action={
          <IconButton
            aria-label={t($ => $.common.close)}
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
