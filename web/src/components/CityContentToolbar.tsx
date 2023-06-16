import React, { memo, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { CopyIcon, FeedbackIcon } from '../assets'
import useWindowDimensions from '../hooks/useWindowDimensions'
import Toolbar from './Toolbar'
import ToolbarItem from './ToolbarItem'

type CityContentToolbarProps = {
  openFeedbackModal: React.Dispatch<React.SetStateAction<boolean>>
  children?: ReactNode
  iconDirection?: 'row' | 'column'
  hasFeedbackOption?: boolean
  hasDivider: boolean
}

const CityContentToolbar = (props: CityContentToolbarProps) => {
  const { children, openFeedbackModal, iconDirection, hasFeedbackOption = true, hasDivider } = props
  const { t } = useTranslation(['categories', 'feedback'])
  const copyToClipboard = () => navigator.clipboard.writeText(window.location.href)
  const { viewportSmall } = useWindowDimensions()

  const onOpenToolbar = () => {
    openFeedbackModal(true)
    if (viewportSmall) {
      document.body.style.overflow = 'hidden'
    }
  }

  return (
    <Toolbar iconDirection={iconDirection} hasDivider={hasDivider}>
      {children}
      <ToolbarItem icon={CopyIcon} text={t('categories:copyLink')} onClick={copyToClipboard} />
      {hasFeedbackOption && <ToolbarItem icon={FeedbackIcon} text={t('feedback:feedback')} onClick={onOpenToolbar} />}
    </Toolbar>
  )
}
export default memo(CityContentToolbar)
