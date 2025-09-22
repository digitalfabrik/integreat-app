import { listItemClasses } from '@mui/material/ListItem'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import React, { ReactElement, ReactNode } from 'react'

type OverlayFooterProps = {
  children: ReactNode[] | ReactNode
}

const OverlayFooterContainer = styled(Paper)`
  display: flex;
  padding: 0;
  background-color: ${props => props.theme.palette.surface.main}80;
  border-radius: 0;

  & .${listItemClasses.root} a {
    height: 40px;
    padding: ${props => props.theme.spacing(1)};
  }
`

const OverlayFooter = ({ children }: OverlayFooterProps): ReactElement => (
  <OverlayFooterContainer elevation={2}>{children}</OverlayFooterContainer>
)

export default OverlayFooter
