import React, { ReactElement, ReactNode } from 'react'
import { Tooltip as ReactTooltip, ITooltip as ReactTooltipType } from 'react-tooltip'
import styled from 'styled-components'

const StyledTooltip = styled(ReactTooltip)`
  z-index: 2;
`

type TooltipProps = {
  tooltipContent: ReactNode
  children: ReactNode
  id: string
} & ReactTooltipType

const Tooltip = ({ children, id, place, tooltipContent, ...props }: TooltipProps): ReactElement => (
  <>
    <div id={id}>{children}</div>
    <StyledTooltip {...props} anchorSelect={`#${id}`}>
      {tooltipContent}
    </StyledTooltip>
  </>
)

export default Tooltip
