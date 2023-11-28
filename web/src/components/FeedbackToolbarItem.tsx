import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FeedbackRouteType } from 'api-client'
import { config } from 'translations/src'

import { FeedbackIcon } from '../assets'
import useCityContentParams from '../hooks/useCityContentParams'
import { RouteType } from '../routes'
import FeedbackContainer from './FeedbackContainer'
import Modal from './Modal'
import ToolbarItem from './ToolbarItem'

type FeedbackToolbarItemProps = {
  route: RouteType
  slug?: string
  isInBottomActionSheet: boolean
}

const FeedbackToolbarItem = ({ route, slug, isInBottomActionSheet }: FeedbackToolbarItemProps): ReactElement => {
  const { cityCode, languageCode } = useCityContentParams()
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { t } = useTranslation('feedback')
  const title = isSubmitted ? t('thanksHeadline') : t('headline')
  const direction = config.getScriptDirection(languageCode)

  return (
    <>
      {isFeedbackOpen && (
        <Modal
          title={title}
          closeModal={() => setIsFeedbackOpen(false)}
          direction={direction}
          wrapInPortal={isInBottomActionSheet}>
          <FeedbackContainer
            closeModal={() => setIsFeedbackOpen(false)}
            onSubmit={() => setIsSubmitted(true)}
            routeType={route as FeedbackRouteType}
            cityCode={cityCode}
            language={languageCode}
            slug={slug}
          />
        </Modal>
      )}
      <ToolbarItem icon={FeedbackIcon} text={t('feedback')} onClick={() => setIsFeedbackOpen(true)} />
    </>
  )
}

export default FeedbackToolbarItem
