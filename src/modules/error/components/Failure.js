// @flow

import React from 'react'
import styled from 'styled-components/native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { Text } from 'react-native'

const ViewContainer = styled.View`
flex: 1;
align-items: center;
margin-top: 15%;
`

const IconContainer = styled(MaterialIcon)`
margin-bottom: 10px;
`

type PropsType = {|
  error: Error
|}

export class Failure extends React.Component<PropsType> {
  render () {
    const { error } = this.props

    return <ViewContainer>
      <IconContainer name='sentiment-dissatisfied' size={55} color={'black'} />
      <Text>{error.message}</Text>
    </ViewContainer>
  }
}

export default Failure
