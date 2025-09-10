import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import React, { ReactElement, ReactNode } from 'react'

type OverlayFooterProps = {
  children: ReactNode[] | ReactNode
}

const OverlayFooterContainer = styled(Paper)`
  display: flex;
  white-space: nowrap;
  padding: ${props => props.theme.spacing(2)};
  background-color: rgb(255 255 255 / 50%);

  ${props => props.theme.breakpoints.up('md')} {
    padding: 0 ${props => props.theme.spacing(1)};
  }
`

const OverlayFooter = ({ children }: OverlayFooterProps): ReactElement => (
  <OverlayFooterContainer
    elevation={2}
    sx={{
      '& .MuiTypography-root': {
        font: '12px/20px "Helvetica Neue", Arial, Helvetica, sans-serif',
      },
      '& .MuiListItem-root': {
        '& a': {
          height: 30,
        },
      },
    }}>
    {children}
  </OverlayFooterContainer>
)

export default OverlayFooter
