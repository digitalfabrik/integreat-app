// @flow

import * as React from 'react'
import styled from 'styled-components'
import type { ThemeType } from '../../../modules/theme/constants/theme'

const Wrapper = styled.View`
  position: absolute;  
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${props => props.theme.colors.backgroundColor};
`

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
