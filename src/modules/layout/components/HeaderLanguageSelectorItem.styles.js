import styled from 'styled-components'
import UnstyledTooltip from '../../common/components/Tooltip'

export const Tooltip = styled(UnstyledTooltip)`
  display: inline-block;
`
export const InactiveImage = styled.img`
  color: ${props => props.theme.colors.textSecondaryColor};
`
