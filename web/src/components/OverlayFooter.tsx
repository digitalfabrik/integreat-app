import { listItemClasses } from '@mui/material/ListItem'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import React, { ReactElement, ReactNode } from 'react'

type OverlayFooterProps = {
  children: ReactNode[] | ReactNode
}

const OverlayFooterContainer = styled(Paper)`
  display: flex;
  padding: ${props => props.theme.spacing(2)};
  background-color: ${props => props.theme.palette.surface.main}80;
  border-radius: 0;

  ${props => props.theme.breakpoints.up('md')} {
    padding: 0 ${props => props.theme.spacing(1)};
  }

  & .${listItemClasses.root} a {
    height: 40px;
  }
`

const OverlayFooter = ({ children }: OverlayFooterProps): ReactElement => (
  <OverlayFooterContainer elevation={2}>{children}</OverlayFooterContainer>
)

export default OverlayFooter
