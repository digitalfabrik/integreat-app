import SentimentDissatisfiedOutlinedIcon from '@mui/icons-material/SentimentDissatisfiedOutlined'
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Rating, RATING_POSITIVE } from 'shared'
import { FeedbackRouteType } from 'shared/api'

import useCityContentParams from '../hooks/useCityContentParams'
import { RouteType } from '../routes'
import FeedbackContainer from './FeedbackContainer'
import Modal from './Modal'
import ToolbarItem from './ToolbarItem'

type FeedbackToolbarItemProps = {
  route: RouteType
  slug?: string
  rating: Rating | null
}

const FeedbackToolbarItem = ({ route, slug, rating }: FeedbackToolbarItemProps): ReactElement => {
  const { cityCode, languageCode } = useCityContentParams()
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { t } = useTranslation('feedback')
  const title = isSubmitted ? t('thanksHeadline') : t('headline')

  return (
    <>
      {isFeedbackOpen && (
        <Modal title={title} closeModal={() => setIsFeedbackOpen(false)} wrapInPortal>
          <FeedbackContainer
            onClose={() => setIsFeedbackOpen(false)}
            onSubmit={() => setIsSubmitted(true)}
            routeType={route as FeedbackRouteType}
            cityCode={cityCode}
            language={languageCode}
            slug={slug}
            initialRating={rating}
          />
        </Modal>
      )}
      <ToolbarItem
        icon={rating === RATING_POSITIVE ? SentimentSatisfiedOutlinedIcon : SentimentDissatisfiedOutlinedIcon}
        text={t(rating === RATING_POSITIVE ? 'useful' : 'notUseful')}
        onClick={() => setIsFeedbackOpen(true)}
      />
    </>
  )
}

export default FeedbackToolbarItem
