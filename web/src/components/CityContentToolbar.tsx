import React, { memo, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { CopyIcon } from '../assets'
import FeedbackToolbarItem, { FeedbackRatingType } from './FeedbackToolbarItem'
import Toolbar from './Toolbar'
import ToolbarItem from './ToolbarItem'

type CityContentToolbarProps = {
  openFeedbackModal: (rating: FeedbackRatingType) => void
  children?: ReactNode
  viewportSmall: boolean
  iconDirection?: 'row' | 'column'
}

const CityContentToolbar = (props: CityContentToolbarProps) => {
  const { viewportSmall, children, openFeedbackModal, iconDirection } = props
  const { t } = useTranslation('categories')
  const copyToClipboard = () => navigator.clipboard.writeText(window.location.href)

  return (
    <Toolbar iconDirection={iconDirection}>
      {children}
      <ToolbarItem icon={CopyIcon} text={t('copyLink')} onClick={copyToClipboard} viewportSmall={viewportSmall} />
      <FeedbackToolbarItem isPositiveRatingLink openFeedbackModal={openFeedbackModal} viewportSmall={viewportSmall} />
      <FeedbackToolbarItem
        isPositiveRatingLink={false}
        openFeedbackModal={openFeedbackModal}
        viewportSmall={viewportSmall}
      />
    </Toolbar>
  )
}
export default memo(CityContentToolbar)
