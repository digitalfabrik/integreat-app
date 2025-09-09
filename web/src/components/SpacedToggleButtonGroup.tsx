import ToggleButtonGroup, { toggleButtonGroupClasses } from '@mui/material/ToggleButtonGroup'
import { styled } from '@mui/material/styles'

const SpacedToggleButtonGroup = styled(ToggleButtonGroup)`
  .${toggleButtonGroupClasses.grouped} {
    border-radius: 18px;
  }

  .${toggleButtonGroupClasses.middleButton}, .${toggleButtonGroupClasses.lastButton} {
    border-inline-start: 1px solid ${props => (props.theme.vars || props.theme).palette.divider};
  }
`

export default SpacedToggleButtonGroup
