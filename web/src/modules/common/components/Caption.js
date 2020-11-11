// @flow

import React from 'react'
import styled from 'styled-components'

const H1 = styled.h1`
  margin: 25px 0;
  font-size: 2rem;
  text-align: center;

  @media ${props => props.theme.dimensions.web.smallViewport} {
    margin: 10px 0;
  }
`

type PropsType = {|
  title: string,
  className?: string
|}

class Caption extends React.PureComponent<PropsType> {
  render () {
    const { title, className } = this.props
    return <H1 className={className}>{title}</H1>
  }
}

export default Caption
