import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { SEARCH_ROUTE } from 'api-client'

import { FeedbackIcon } from '../assets'
import useCityContentParams from '../hooks/useCityContentParams'
import { RouteType } from '../routes'
import FeedbackModal from './FeedbackModal'
import { LAYOUT_ELEMENT_ID } from './Layout'
import ToolbarItem from './ToolbarItem'

type FeedbackToolbarItemProps = {
  route: RouteType
  slug?: string
}

const FeedbackToolbarItem = ({ route, slug }: FeedbackToolbarItemProps): ReactElement => {
  const { cityCode, languageCode } = useCityContentParams()
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const { t } = useTranslation('feedback')

  const openFeedback = () => {
    setIsFeedbackOpen(true)
    document.getElementById(LAYOUT_ELEMENT_ID)?.setAttribute('aria-hidden', 'true')
  }

  const closeFeedback = () => {
    setIsFeedbackOpen(false)
    document.getElementById(LAYOUT_ELEMENT_ID)?.setAttribute('aria-hidden', 'false')
  }

  return (
    <>
      {route !== SEARCH_ROUTE && isFeedbackOpen && (
        <FeedbackModal
          cityCode={cityCode}
          language={languageCode}
          routeType={route}
          slug={slug}
          visible={isFeedbackOpen}
          closeModal={closeFeedback}
        />
      )}
      <ToolbarItem icon={FeedbackIcon} text={t('feedback')} onClick={openFeedback} />
    </>
  )
}

export default FeedbackToolbarItem
