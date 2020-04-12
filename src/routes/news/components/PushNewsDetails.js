// @flow

import * as React from 'react'
import styled from 'styled-components'

const StyledBanner = styled.div`
  display: flex;
  align-items: center;
  height: 50px;
  background-color: rgba(2, 121, 166, 0.4);
  border-radius: 11px;
  overflow: hidden;
  font-size: 36px;
  margin: 25px 0;
  padding-left: 20px;
`
const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #6f6f6e;
  margin-bottom: 25px;
`
const Content = styled.p`
  font-size: 16px;
  line-height: 1.38;
  color: #6f6f6e;
`

type PropsType = {|
  title: string,
  message: string,
  timestap: any
|}

// This just a placeholder until the page design is ready
class PushNewsDetails extends React.PureComponent<PropsType> {
  render () {
    const { title, message, timestap } = this.props
    return (
      <div
        style={{
          maxWidth: 660
        }}
        >
        <StyledBanner>
          Local News
        </StyledBanner>

        <Title>{title}</Title>
        <Content>{message}</Content>
      </div>
    )
  }
}

export default PushNewsDetails
