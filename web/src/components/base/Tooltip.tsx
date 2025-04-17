import React, { ReactElement, ReactNode } from 'react'
import { Tooltip as ReactTooltip, ITooltip as ReactTooltipType } from 'react-tooltip'
import styled from 'styled-components'

import { useContrastTheme } from '../../hooks/useContrastTheme'

const StyledTooltip = styled(ReactTooltip)<{ $isContrastTheme: boolean }>`
  z-index: 60;
  ${props =>
    props.$isContrastTheme &&
    `
        color: ${props.theme.colors.textColor};
        background-color: ${props.theme.colors.textSecondaryColor};
      `}
`

type TooltipProps = {
  tooltipContent: ReactNode
  children: ReactNode
  id: string
} & ReactTooltipType

const Tooltip = ({ children, id, place, tooltipContent, ...props }: TooltipProps): ReactElement => {
  const sanitizedId = id.replace(/:/g, '')
  const { isContrastTheme } = useContrastTheme()
  return (
    <>
      <div id={sanitizedId}>{children}</div>
      <StyledTooltip {...props} anchorSelect={`#${sanitizedId}`} $isContrastTheme={isContrastTheme}>
        {tooltipContent}
      </StyledTooltip>
    </>
  )
}

export default Tooltip
