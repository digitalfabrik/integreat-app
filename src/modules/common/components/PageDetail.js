// @flow

import * as React from 'react'
import { View, Text } from 'react-native'
import styled from 'styled-components'

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
      <View>
        <Identifier>{identifier}: </Identifier>
        <Text>{information}</Text>
      </View>
    )
  }
}

export default PageDetail
