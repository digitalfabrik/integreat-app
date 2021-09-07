import React, { ReactElement } from 'react'

import { IconDefinition } from '@fortawesome/fontawesome-common-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import StyledSmallViewTip from './StyledSmallViewTip'
import StyledToolbarItem from './StyledToolbarItem'
import Tooltip from './Tooltip'

type PropsType = {
  href: string
  icon: IconDefinition
  text: string
  viewportSmall: boolean
}

const ToolbarItem = ({ href, text, icon, viewportSmall }: PropsType): ReactElement => {
  return (
    <Tooltip text={viewportSmall ? null : text} flow='up' mediumViewportFlow='right' smallViewportFlow='down'>
      <StyledToolbarItem href={href} ariaLabel={text}>
        <FontAwesomeIcon icon={icon} />
        {viewportSmall && <StyledSmallViewTip>{text}</StyledSmallViewTip>}
      </StyledToolbarItem>
    </Tooltip>
  )
}

export default ToolbarItem
