import React, { ReactElement } from 'react'
import styled from 'styled-components'

import dimensions from '../constants/dimensions'

const H1 = styled.h1`
  margin: 25px 0;
  font-size: 2rem;
  text-align: center;

  @media ${dimensions.smallViewport} {
    margin: 10px 0;
  }
`

type PropsType = {
  title: string
}

const Caption = ({ title }: PropsType): ReactElement => <H1>{title}</H1>

export default Caption
