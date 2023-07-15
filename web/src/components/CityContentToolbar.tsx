import React, { memo, ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CopyIcon, DoneIcon } from '../assets'
import { RouteType } from '../routes'
import FeedbackToolbarItem from './FeedbackToolbarItem'
import Toolbar from './Toolbar'
import ToolbarItem from './ToolbarItem'
import Tooltip from './Tooltip'

type CityContentToolbarProps = {
  feedbackTarget?: string
  children?: ReactNode
  iconDirection?: 'row' | 'column'
  hasFeedbackOption?: boolean
  hideDivider?: boolean
  route: RouteType
}

const COPY_TIMEOUT = 3000

const CityContentToolbar = (props: CityContentToolbarProps) => {
  const { feedbackTarget, children, iconDirection, hasFeedbackOption = true, hideDivider, route } = props
  const [linkCopied, setLinkCopied] = useState<boolean>(false)
  const { t } = useTranslation('categories')
  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).catch(reportError)
    setLinkCopied(true)
    setTimeout(() => {
      setLinkCopied(false)
    }, COPY_TIMEOUT)
  }

  return (
    <Toolbar iconDirection={iconDirection} hideDivider={hideDivider}>
      {children}
      <Tooltip text={t('common:copied')} flow='up' active={linkCopied} trigger='click'>
        <ToolbarItem icon={linkCopied ? DoneIcon : CopyIcon} text={t('copyUrl')} onClick={copyToClipboard} />
      </Tooltip>
      {hasFeedbackOption && <FeedbackToolbarItem route={route} slug={feedbackTarget} />}
    </Toolbar>
  )
}
export default memo(CityContentToolbar)
