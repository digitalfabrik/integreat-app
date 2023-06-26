import React, { memo, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { CopyIcon } from '../assets'
import FeedbackToolbarItem, { FeedbackRatingType } from './FeedbackToolbarItem'
import Toolbar from './Toolbar'
import ToolbarItem from './ToolbarItem'

type CityContentToolbarProps = {
  openFeedbackModal: (rating: FeedbackRatingType) => void
  children?: ReactNode
  iconDirection?: 'row' | 'column'
  hasFeedbackOption?: boolean
  hasDivider: boolean
}

const CityContentToolbar = (props: CityContentToolbarProps) => {
  const { children, openFeedbackModal, iconDirection, hasFeedbackOption = true, hasDivider } = props
  const { t } = useTranslation('categories')
  const copyToClipboard = () => navigator.clipboard.writeText(window.location.href)

  return (
    <Toolbar iconDirection={iconDirection} hasDivider={hasDivider}>
      {children}
      <ToolbarItem icon={CopyIcon} text={t('copyUrl')} onClick={copyToClipboard} />
      {hasFeedbackOption && <FeedbackToolbarItem isPositiveRatingLink openFeedbackModal={openFeedbackModal} />}
      {hasFeedbackOption && <FeedbackToolbarItem isPositiveRatingLink={false} openFeedbackModal={openFeedbackModal} />}
    </Toolbar>
  )
}
export default memo(CityContentToolbar)
