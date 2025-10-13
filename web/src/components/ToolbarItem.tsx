import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

const StyledButton = styled(ListItemButton)({
  flexDirection: 'column',
  padding: 8,
  width: 120,
}) as typeof ListItemButton

export type ToolbarItemProps = {
  icon: ReactElement
  text: string
  onClick: () => void
}

const ToolbarItem = ({ text, icon, onClick }: ToolbarItemProps): ReactElement => (
  <ListItem disablePadding>
    <StyledButton onClick={onClick}>
      {icon}
      <ListItemText
        disableTypography
        primary={
          <Typography component='div' variant='label2' textAlign='center'>
            {text}
          </Typography>
        }
      />
    </StyledButton>
  </ListItem>
)

export default ToolbarItem
