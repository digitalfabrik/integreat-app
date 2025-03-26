import React, { ReactElement, ReactNode } from 'react'
import { Tooltip as ReactTooltip, ITooltip as ReactTooltipType } from 'react-tooltip'
import styled from 'styled-components'

const StyledTooltip = styled(ReactTooltip)`
  z-index: 1;
`

type TooltipProps = {
  tooltipContent: ReactNode
  children: ReactNode
  id: string
} & ReactTooltipType

const Tooltip = ({ children, id, place, tooltipContent, ...props }: TooltipProps): ReactElement => {
  const sanitizedId = id.replace(/:/g, '')
  return (
    <>
      <div id={sanitizedId}>{children}</div>
      <StyledTooltip {...props} anchorSelect={`#${sanitizedId}`}>
        {tooltipContent}
      </StyledTooltip>
    </>
  )
}

export default Tooltip
