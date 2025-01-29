import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FeedbackRouteType } from 'shared/api'

import { HappySmileyIcon, SadSmileyIcon } from '../assets'
import useCityContentParams from '../hooks/useCityContentParams'
import { RouteType } from '../routes'
import FeedbackContainer from './FeedbackContainer'
import Modal from './Modal'
import ToolbarItem from './ToolbarItem'

type FeedbackToolbarItemProps = {
  route: RouteType
  slug?: string
  positive: boolean
}

const FeedbackToolbarItem = ({ route, slug, positive }: FeedbackToolbarItemProps): ReactElement => {
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
            initialRating={positive}
          />
        </Modal>
      )}
      <ToolbarItem
        icon={positive ? HappySmileyIcon : SadSmileyIcon}
        text={t(positive ? 'useful' : 'notUseful')}
        onClick={() => setIsFeedbackOpen(true)}
      />
    </>
  )
}

export default FeedbackToolbarItem
