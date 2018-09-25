// @flow

import * as React from 'react'
import styled from 'styled-components'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import { NavigationActions, StackActions } from 'react-navigation'
import CityModel from '../../../modules/endpoint/models/CityModel'

const Wrapper = styled.View`
  position: absolute;  
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${props => props.theme.colors.backgroundColor};
`

const resetAction = StackActions.reset({
  index: 1,
  actions: [
    NavigationActions.navigate({
      routeName: 'Dashboard',
      params: {cityModel: new CityModel({name: 'Ahaus', code: 'ahaus'})}
    }),
    NavigationActions.navigate({
      routeName: 'Dashboard',
      params: {cityModel: new CityModel({name: 'Augsburg', code: 'augsburg'})}
    })]
})
this.getNavigation().dispatch(resetAction)

type PropsType = {
  theme: ThemeType,
  changeLanguage: (language: string) => void
}

class ChangeLanguageModal extends React.Component<PropsType> {
  render () {
    return <Wrapper theme={this.props.theme} />
  }
}

export default ChangeLanguageModal
