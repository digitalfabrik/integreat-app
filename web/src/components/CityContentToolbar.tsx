import React, { memo, ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CopyIcon, DoneIcon } from '../assets'
import FeedbackToolbarItem, { FeedbackRatingType } from './FeedbackToolbarItem'
import Toolbar from './Toolbar'
import ToolbarItem from './ToolbarItem'
import Tooltip from './Tooltip'

type CityContentToolbarProps = {
  openFeedbackModal: (rating: FeedbackRatingType) => void
  children?: ReactNode
  iconDirection?: 'row' | 'column'
  hasFeedbackOption?: boolean
  hasDivider: boolean
}

const COPY_TIMEOUT = 3000

const CityContentToolbar = (props: CityContentToolbarProps) => {
  const { children, openFeedbackModal, iconDirection, hasFeedbackOption = true, hasDivider } = props
  const [linkCopied, setLinkCopied] = useState<boolean>(false)
  const { t } = useTranslation('categories')
  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    setLinkCopied(true)
    setTimeout(() => {
      setLinkCopied(false)
    }, COPY_TIMEOUT)
  }

  return (
    <Toolbar iconDirection={iconDirection} hasDivider={hasDivider}>
      {children}
      <Tooltip text={t('common:textCopied')} flow='up' active={linkCopied} trigger='click'>
        <ToolbarItem icon={linkCopied ? DoneIcon : CopyIcon} text={t('copyUrl')} onClick={copyToClipboard} />
      </Tooltip>
      {hasFeedbackOption && <FeedbackToolbarItem isPositiveRatingLink openFeedbackModal={openFeedbackModal} />}
      {hasFeedbackOption && <FeedbackToolbarItem isPositiveRatingLink={false} openFeedbackModal={openFeedbackModal} />}
    </Toolbar>
  )
}
export default memo(CityContentToolbar)
