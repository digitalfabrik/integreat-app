import * as React from 'react'
import logo from '../assets/integreat-app-logo.png'
import styled from 'styled-components'
import HeaderButtons, { HeaderButton, Item } from 'react-navigation-header-buttons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { StyleSheet } from 'react-native'

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
  background-color: #fafafa;
  height: 60px;
`

const MaterialHeaderButton = props => (
  <HeaderButton {...props} IconComponent={MaterialIcons} iconSize={23} color='black' />
)

export const MaterialHeaderButtons = props => {
  return (
    <HeaderButtons
      HeaderButtonComponent={MaterialHeaderButton}
      OverflowIcon={<MaterialIcons name='more-vert' size={23} color='black' />}
      {...props}
    />
  )
}

const styles = StyleSheet.create({
  headerButtons: {
    alignSelf: 'flex-end'
  }
})

const Header = props => {
  const {options} = props.scene.descriptor
  const headerTitle = options.headerTitle

  return (
    <BoxShadow>
      <Horizonal>
        <Logo source={logo} />
        <Title>{headerTitle}</Title>
        <MaterialHeaderButtons>
          <Item title='add' iconName='search' onPress={() => console.warn('add')} />
          <Item title='edit' iconName='edit' onPress={() => console.warn('edit')} />
          <Item title='asdf' show='never' onPress={() => console.warn('edit')} />
        </MaterialHeaderButtons>
      </Horizonal>
    </BoxShadow>
  )
}

export default Header
