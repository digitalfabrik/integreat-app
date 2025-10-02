import SentimentDissatisfiedOutlinedIcon from '@mui/icons-material/SentimentDissatisfiedOutlined'
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Rating, RATING_POSITIVE } from 'shared'

import FeedbackContainer from './FeedbackContainer'
import ToolbarItem from './ToolbarItem'
import Dialog from './base/Dialog'
import Snackbar, { handleClose } from './base/Snackbar'

type FeedbackToolbarItemProps = {
  slug?: string
  rating: Rating | null
}

export type SendingStatusType = 'idle' | 'sending' | 'failed' | 'successful'
const FeedbackToolbarItem = ({ slug, rating }: FeedbackToolbarItemProps): ReactElement => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const { t } = useTranslation('feedback')
  const title = isSubmitted ? t('thanksHeadline') : t('headline')
  const [snackbarStatus, setSnackbarStatus] = useState<SendingStatusType>('idle')

  const handleFeedbackSuccess = () => {
    setIsFeedbackOpen(false)
    setSnackbarStatus('successful')
    setIsSubmitted(true)
    setSnackbarOpen(true)
  }

  const handleFeedbackError = () => {
    setIsFeedbackOpen(true)
    setSnackbarStatus('failed')
    setSnackbarOpen(true)
  }

  return (
    <>
      {isFeedbackOpen && (
        <Dialog title={title} close={() => setIsFeedbackOpen(false)}>
          <FeedbackContainer onSubmit={handleFeedbackSuccess}
            onError={handleFeedbackError} slug={slug} initialRating={rating} />
        </Dialog>
      )}
      <ToolbarItem
        icon={rating === RATING_POSITIVE ? <SentimentSatisfiedOutlinedIcon /> : <SentimentDissatisfiedOutlinedIcon />}
        text={t(rating === RATING_POSITIVE ? 'useful' : 'notUseful')}
        onClick={() => setIsFeedbackOpen(true)}
      />
      <Snackbar
        open={snackbarOpen}
        onClose={handleClose(setSnackbarOpen)}
        sendingStatus={snackbarStatus}
        successMessage={t('thanksMessage')}
        autoHideOnSuccess
      />
    </>
  )
}

export default FeedbackToolbarItem
