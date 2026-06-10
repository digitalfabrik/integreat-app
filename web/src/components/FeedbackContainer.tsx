import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'

import {
  FEEDBACK_QUERY_KEY,
  parseQueryParams,
  Rating,
  RATING_NEGATIVE,
  RATING_POSITIVE,
  SEARCH_ROUTE,
  SendingStatusType,
} from 'shared'
import { createFeedbackEndpoint, FeedbackRouteType } from 'shared/api'

import { cmsApiBaseUrl } from '../constants/urls'
import useQueryParamVisibility from '../hooks/useQueryParamVisibility'
import useRegionContentParams from '../hooks/useRegionContentParams'
import { captureError } from '../utils/sentry'
import Feedback from './Feedback'
import Dialog from './base/Dialog'
import Snackbar from './base/Snackbar'

type FeedbackContainerProps = {
  slug?: string
}

const FeedbackContainer = ({ slug }: FeedbackContainerProps): ReactElement | null => {
  const { visible, close } = useQueryParamVisibility(FEEDBACK_QUERY_KEY)
  const [queryParams] = useSearchParams()
  const { t } = useTranslation('feedback')
  const [comment, setComment] = useState<string>('')
  const [contactMail, setContactMail] = useState<string>('')
  const [sendingStatus, setSendingStatus] = useState<SendingStatusType>('idle')
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const { route, regionCode, languageCode } = useRegionContentParams()

  const { feedback, searchText } = parseQueryParams(queryParams)
  const initialRating = feedback === RATING_POSITIVE || feedback === RATING_NEGATIVE ? feedback : null
  const query = route === SEARCH_ROUTE ? searchText : undefined
  const [rating, setRating] = useState<Rating | null>(initialRating)
  const [searchTerm, setSearchTerm] = useState<string | undefined>(query)

  useEffect(() => setRating(initialRating), [initialRating])

  useEffect(() => {
    setSearchTerm(query)
  }, [query])

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
