import React, { ReactElement, ReactNode } from 'react'
import { Tooltip as ReactTooltip, ITooltip as ReactTooltipType } from 'react-tooltip'

type TooltipProps = {
  tooltipContent: ReactNode
  children: ReactNode
  id: string
} & ReactTooltipType

const Tooltip = ({ children, id, place, tooltipContent, ...props }: TooltipProps): ReactElement => (
  <>
    <div id={id}>{children}</div>
    <ReactTooltip {...props} anchorSelect={`#${id}`}>
      {tooltipContent}
    </ReactTooltip>
  </>
)

export default Tooltip
