import SentimentDissatisfiedOutlinedIcon from '@mui/icons-material/SentimentDissatisfiedOutlined'
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { FEEDBACK_QUERY_KEY, RATING_POSITIVE, Rating } from 'shared'

import useQueryParamVisibility from '../hooks/useQueryParamVisibility'
import ToolbarItem from './ToolbarItem'

const FeedbackToolbarItem = ({ rating }: { rating: Rating | null }): ReactElement => {
  const { t } = useTranslation('feedback')
  const { open } = useQueryParamVisibility(FEEDBACK_QUERY_KEY)

  return (
    <ToolbarItem
      icon={rating === RATING_POSITIVE ? <SentimentSatisfiedOutlinedIcon /> : <SentimentDissatisfiedOutlinedIcon />}
      text={t(rating === RATING_POSITIVE ? 'useful' : 'notUseful')}
      onClick={() => open(rating ?? undefined)}
    />
  )
}

export default FeedbackToolbarItem
