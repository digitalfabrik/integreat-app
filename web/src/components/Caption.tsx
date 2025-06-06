import styled from '@emotion/styled'
import React, { ReactElement } from 'react'

import dimensions from '../constants/dimensions'

const H1 = styled.h1`
  margin: 25px 0;
  font-size: 2rem;
  text-align: center;

  @media ${dimensions.smallViewport} {
    margin: 10px 0;
  }
`

type CaptionProps = {
  title: string
}

const Caption = ({ title }: CaptionProps): ReactElement => <H1 dir='auto'>{title}</H1>

export default Caption
