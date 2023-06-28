import React, { memo, ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CopyIcon, DoneIcon, FeedbackIcon } from '../assets'
import useWindowDimensions from '../hooks/useWindowDimensions'
import Toolbar from './Toolbar'
import ToolbarItem from './ToolbarItem'
import Tooltip from './Tooltip'

type CityContentToolbarProps = {
  openFeedbackModal: React.Dispatch<React.SetStateAction<boolean>>
  children?: ReactNode
  iconDirection?: 'row' | 'column'
  hasFeedbackOption?: boolean
  hasDivider: boolean
}

const COPY_TIMEOUT = 3000

const CityContentToolbar = (props: CityContentToolbarProps) => {
  const { children, openFeedbackModal, iconDirection, hasFeedbackOption = true, hasDivider } = props
  const [linkCopied, setLinkCopied] = useState<boolean>(false)
  const { viewportSmall } = useWindowDimensions()
  const { t } = useTranslation('categories')
  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    setLinkCopied(true)
    setTimeout(() => {
      setLinkCopied(false)
    }, COPY_TIMEOUT)
  }

  const onOpenToolbar = () => {
    openFeedbackModal(true)
    if (viewportSmall) {
      document.body.style.overflow = 'hidden'
    }
  }

  return (
    <Toolbar iconDirection={iconDirection} hasDivider={hasDivider}>
      {children}
      <Tooltip text={t('cityNotCooperating:textCopied')} flow='up' active={linkCopied} trigger='click'>
        <ToolbarItem icon={linkCopied ? DoneIcon : CopyIcon} text={t('copyUrl')} onClick={copyToClipboard} />
      </Tooltip>
      {hasFeedbackOption && <ToolbarItem icon={FeedbackIcon} text={t('feedback:feedback')} onClick={onOpenToolbar} />}
    </Toolbar>
  )
}
export default memo(CityContentToolbar)
