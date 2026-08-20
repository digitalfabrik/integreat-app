import SentimentDissatisfiedOutlinedIcon from '@mui/icons-material/SentimentDissatisfiedOutlined'
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { FEEDBACK_QUERY_KEY, RATING_POSITIVE, Rating } from 'shared'

import useQueryParam from '../hooks/useQueryParam'
import ToolbarItem from './ToolbarItem'

const FeedbackToolbarItem = ({ rating }: { rating: Rating }): ReactElement => {
  const { t } = useTranslation('feedback')
  const { set } = useQueryParam(FEEDBACK_QUERY_KEY)

  return (
    <ToolbarItem
      icon={rating === RATING_POSITIVE ? <SentimentSatisfiedOutlinedIcon /> : <SentimentDissatisfiedOutlinedIcon />}
      text={t(rating === RATING_POSITIVE ? 'useful' : 'notUseful')}
      onClick={() => set(rating)}
    />
  )
}

export default FeedbackToolbarItem
