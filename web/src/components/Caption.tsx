import styled from '@emotion/styled'
import React, { ReactElement } from 'react'

import dimensions from '../constants/dimensions'

const H1 = styled.h1<{ highlighted?: boolean }>`
  background-color: ${props => (props.highlighted ? props.theme.colors.themeColor : 'transparent')};
  margin: 25px 0;
  font-size: 2rem;
  text-align: center;

  @media ${dimensions.smallViewport} {
    margin: 10px 0;
  }
`

type CaptionProps = {
  title: string
  highlighted?: boolean
}

const Caption = ({ title, highlighted = false }: CaptionProps): ReactElement => (
  <H1 dir='auto' highlighted={highlighted}>
    {title}
  </H1>
)

export default Caption
