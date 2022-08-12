import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import React, { ReactElement } from 'react'

import StyledSmallViewTip from './StyledSmallViewTip'
import StyledToolbarItem from './StyledToolbarItem'
import Tooltip from './Tooltip'

type PropsType = {
  href: string
  icon: FontAwesomeIconProps['icon']
  text: string
  viewportSmall: boolean
}

const ToolbarItem = ({ href, text, icon, viewportSmall }: PropsType): ReactElement => (
  <Tooltip text={viewportSmall ? null : text} flow='up' mediumViewportFlow='right' smallViewportFlow='down'>
    <StyledToolbarItem href={href} ariaLabel={text}>
      <FontAwesomeIcon icon={icon} />
      {viewportSmall && <StyledSmallViewTip>{text}</StyledSmallViewTip>}
    </StyledToolbarItem>
  </Tooltip>
)

export default ToolbarItem
