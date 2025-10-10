import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Rating, SendingStatusType } from 'shared'
import { createFeedbackEndpoint, FeedbackRouteType } from 'shared/api'

import { cmsApiBaseUrl } from '../constants/urls'
import useCityContentParams from '../hooks/useCityContentParams'
import { reportError } from '../utils/sentry'
import Feedback from './Feedback'
import Snackbar from './base/Snackbar'

type FeedbackContainerProps = {
  query?: string
  noResults?: boolean
  slug?: string
  onSubmit?: () => void
  onError?: () => void
  initialRating: Rating | null
}

export const FeedbackContainer = ({
  query,
  noResults,
  slug,
  onSubmit,
  onError,
  initialRating,
}: FeedbackContainerProps): ReactElement => {
  const { t } = useTranslation('feedback')
  const [rating, setRating] = useState<Rating | null>(initialRating)
  const [comment, setComment] = useState<string>('')
  const [contactMail, setContactMail] = useState<string>('')
  const [sendingStatus, setSendingStatus] = useState<SendingStatusType>('idle')
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState<string | undefined>(query)
  const { route, cityCode, languageCode } = useCityContentParams()

  useEffect(() => {
    setSearchTerm(query)
  }, [query])

  const handleSubmit = () => {
    setSendingStatus('sending')

    const request = async () => {
      const feedbackEndpoint = createFeedbackEndpoint(cmsApiBaseUrl)
      await feedbackEndpoint.request({
        routeType: route as FeedbackRouteType,
        city: cityCode,
        language: languageCode,
        comment,
        contactMail,
        query,
        slug,
        searchTerm,
        isPositiveRating: !noResults && rating === 'positive',
      })

      setSendingStatus('successful')
      setSnackbarOpen(true)
      onSubmit?.()
    }

    request().catch(err => {
      reportError(err)
      setSendingStatus('failed')
      setSnackbarOpen(true)
      onError?.()
    })
  }

  return (
    <>
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
            <CloseIcon fontSize='inherit' />
          </IconButton>
        }
      />
    </>
  )
}

export default FeedbackContainer
