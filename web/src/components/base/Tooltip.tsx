import React, { ReactElement, ReactNode } from 'react'
import { Tooltip as ReactTooltip, ITooltip as ReactTooltipType } from 'react-tooltip'

type TooltipProps = {
  children: ReactNode
  container: ReactElement
  id: string
} & ReactTooltipType

const Tooltip = ({ container, children, id, place, ...props }: TooltipProps): ReactElement => (
  <>
    <div id={id}>{container}</div>
    <ReactTooltip {...props} anchorSelect={`#${id}`}>
      {children}
    </ReactTooltip>
  </>
)

export default Tooltip
