import * as React from 'react'
import logo from '../assets/integreat-app-logo.png'
import styled from 'styled-components'
import { Text } from 'react-native-elements'

const Horizonal = styled.View`
  flex:1;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`

const Logo = styled.Image`
  width: 150px;
  height: 50px;
  resize-mode: contain;
`

const Title = styled.Text`
 font-size: 30px;
 color: black;
 margin-left: 10px;
`

const BoxShadow = styled.View`
  elevation: 1;
  background-color: #fafafa;
  height: 60px;
`
const Header = props => {
  const {options} = props.scene.descriptor
  const headerTitle = options.headerTitle
  console.log(JSON.stringify(options))
  return (
    <BoxShadow>
      <Horizonal>
        <Logo source={logo} />
        <Title>{headerTitle}</Title>
      </Horizonal>
    </BoxShadow>
  )
}

export default Header
