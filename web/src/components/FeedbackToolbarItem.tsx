import SentimentDissatisfiedOutlinedIcon from '@mui/icons-material/SentimentDissatisfiedOutlined'
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Rating, RATING_POSITIVE } from 'shared'

import FeedbackContainer from './FeedbackContainer'
import ToolbarItem from './ToolbarItem'
import Dialog from './base/Dialog'

type FeedbackToolbarItemProps = {
  slug?: string
  rating: Rating | null
}

const FeedbackToolbarItem = ({ slug, rating }: FeedbackToolbarItemProps): ReactElement => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { t } = useTranslation('feedback')
  const title = isSubmitted ? t('thanksHeadline') : t('headline')

  return (
    <>
      {isFeedbackOpen && (
        <Dialog title={title} close={() => setIsFeedbackOpen(false)}>
          <FeedbackContainer onSubmit={() => setIsSubmitted(true)} slug={slug} initialRating={rating} />
        </Dialog>
      )}
      <ToolbarItem
        icon={rating === RATING_POSITIVE ? <SentimentSatisfiedOutlinedIcon /> : <SentimentDissatisfiedOutlinedIcon />}
        text={t(rating === RATING_POSITIVE ? 'useful' : 'notUseful')}
        onClick={() => setIsFeedbackOpen(true)}
      />
    </>
  )
}

export default FeedbackToolbarItem
