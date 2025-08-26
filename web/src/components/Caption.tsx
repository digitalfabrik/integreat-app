import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

const H1 = styled('h1')`
  margin: 25px 0;
  font-size: 2rem;
  text-align: center;

  ${props => props.theme.breakpoints.down('md')} {
    margin: 10px 0;
  }
`

type CaptionProps = {
  title: string
}

const Caption = ({ title }: CaptionProps): ReactElement => <H1 dir='auto'>{title}</H1>

export default Caption
