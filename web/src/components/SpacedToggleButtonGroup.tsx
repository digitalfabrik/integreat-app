import styled from '@emotion/styled'
import { ToggleButtonGroup, toggleButtonGroupClasses } from '@mui/material'

const SpacedToggleButtonGroup = styled(ToggleButtonGroup)`
  .${toggleButtonGroupClasses.grouped} {
    border-radius: 18px;
  }

  .${toggleButtonGroupClasses.middleButton}, .${toggleButtonGroupClasses.lastButton} {
    border-inline-start: 1px solid ${props => (props.theme.vars || props.theme).palette.divider};
  }
`

export default SpacedToggleButtonGroup
