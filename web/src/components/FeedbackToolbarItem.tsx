import SentimentDissatisfiedOutlinedIcon from '@mui/icons-material/SentimentDissatisfiedOutlined'
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Rating, RATING_POSITIVE, SendingStatusType } from 'shared'

import FeedbackContainer from './FeedbackContainer'
import ToolbarItem from './ToolbarItem'
import Dialog from './base/Dialog'
import Snackbar from './base/Snackbar'

type FeedbackToolbarItemProps = {
  slug?: string
  rating: Rating | null
}

const FeedbackToolbarItem = ({ slug, rating }: FeedbackToolbarItemProps): ReactElement => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const { t } = useTranslation('feedback')
  const [sendingStatus, setSendingStatus] = useState<SendingStatusType>('idle')
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const handleFeedbackSuccess = () => {
    setIsFeedbackOpen(false)
    setSendingStatus('successful')
    setSnackbarOpen(true)
  }

  const handleFeedbackError = () => {
    setIsFeedbackOpen(true)
    setSendingStatus('failed')
    setSnackbarOpen(true)
  }

  return (
    <>
      {isFeedbackOpen && (
        <Dialog title={t('headline')} close={() => setIsFeedbackOpen(false)}>
          <FeedbackContainer
            onSubmit={handleFeedbackSuccess}
            onError={handleFeedbackError}
            slug={slug}
            initialRating={rating}
          />
        </Dialog>
      )}
      <ToolbarItem
        icon={rating === RATING_POSITIVE ? <SentimentSatisfiedOutlinedIcon /> : <SentimentDissatisfiedOutlinedIcon />}
        text={t(rating === RATING_POSITIVE ? 'useful' : 'notUseful')}
        onClick={() => setIsFeedbackOpen(true)}
      />
      <Snackbar
        open={snackbarOpen}
        severity={sendingStatus === 'successful' ? 'success' : 'error'}
        onClose={() => setSnackbarOpen(false)}
        message={sendingStatus === 'successful' ? t('thanksMessage') : t('failedSendingFeedback')}
      />
    </>
  )
}

export default FeedbackToolbarItem
