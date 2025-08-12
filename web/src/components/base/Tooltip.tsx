import styled from '@emotion/styled'
import React, { ReactElement, ReactNode } from 'react'
import { Tooltip as ReactTooltip, ITooltip as ReactTooltipType } from 'react-tooltip'

const StyledTooltip = styled(ReactTooltip)`
  z-index: 60;
  ${props =>
    props.theme.isContrastTheme &&
    `
        color: ${props.theme.legacy.colors.textColor};
        background-color: ${props.theme.legacy.colors.textSecondaryColor};
      `}
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
