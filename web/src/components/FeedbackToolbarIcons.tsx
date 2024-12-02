import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FeedbackRouteType } from 'shared/api'

import { HappySmileyIcon, SadSmileyIcon } from '../assets'
import useCityContentParams from '../hooks/useCityContentParams'
import { RouteType } from '../routes'
import FeedbackContainer from './FeedbackContainer'
import Modal from './Modal'
import ToolbarItem from './ToolbarItem'

type FeedbackToolbarIconsProps = {
  route: RouteType
  slug?: string
}

const FeedbackToolbarIcons = ({ route, slug }: FeedbackToolbarIconsProps): ReactElement => {
  const { cityCode, languageCode } = useCityContentParams()
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isPositiveRating, setIsPositiveRating] = useState<boolean | null>(null)
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
            isPositiveRating={isPositiveRating}
            setIsPositiveRating={setIsPositiveRating}
          />
        </Modal>
      )}
      <ToolbarItem
        icon={HappySmileyIcon}
        text={t('useful')}
        onClick={() => {
          setIsFeedbackOpen(true)
          setIsPositiveRating(true)
        }}
      />
      <ToolbarItem
        icon={SadSmileyIcon}
        text={t('notUseful')}
        onClick={() => {
          setIsFeedbackOpen(true)
          setIsPositiveRating(false)
        }}
      />
    </>
  )
}

export default FeedbackToolbarIcons
