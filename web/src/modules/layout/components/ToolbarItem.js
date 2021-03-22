// @flow

import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import StyledToolbarItem from './StyledToolbarItem'
import StyledSmallViewTip from './StyledSmallViewTip'
import Tooltip from '../../common/components/Tooltip'
import type { UiDirectionType } from '../../i18n/types/UiDirectionType'

type PropsType = {|
  href: string,
  icon: {},
  text: string,
  viewportSmall: boolean,
  direction: UiDirectionType
|}

const ToolbarItem = ({ href, text, icon, viewportSmall, direction }: PropsType) => {
  return (
    <Tooltip
      text={viewportSmall ? null : text}
      flow='up'
      mediumViewportFlow='right'
      smallViewportFlow='down'
      direction={direction}>
      <StyledToolbarItem href={href} ariaLabel={text}>
        <FontAwesomeIcon icon={icon} />
        {viewportSmall && <StyledSmallViewTip>{text}</StyledSmallViewTip>}
      </StyledToolbarItem>
    </Tooltip>
  )
}

export default ToolbarItem
