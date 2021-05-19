import React from 'react'
import styled from 'styled-components'

const Identifier = styled.span`
  font-weight: 700;
`

type PropsType = {
  identifier: string
  information: string
}

class PageDetail extends React.PureComponent<PropsType> {
  render() {
    const { identifier, information } = this.props
    return (
      <div>
        <Identifier>{identifier}: </Identifier>
        <span>{information}</span>
      </div>
    )
  }
}

export default PageDetail
