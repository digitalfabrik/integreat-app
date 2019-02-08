// @flow

import * as React from 'react'
import { Text } from 'react-native'
import styled from 'styled-components'

const DetailContainer = styled.View`
  margin: 0 10px;
`

const Identifier = styled.Text`
  font-weight: 700;
`

type PropsType = {|
  identifier: string,
  information: string
|}

class PageDetail extends React.PureComponent<PropsType> {
  render () {
    const {identifier, information} = this.props
    return (
      <DetailContainer>
        <Identifier>{identifier}: </Identifier>
        <Text>{information}</Text>
      </DetailContainer>
    )
  }
}

export default PageDetail
