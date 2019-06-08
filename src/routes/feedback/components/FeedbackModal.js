// @flow

import * as React from 'react'
import styled from 'styled-components/native'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import type { NavigationScreenProp } from 'react-navigation'
import Caption from '../../../modules/common/components/Caption'
import type { TFunction } from 'react-i18next'

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
  closeModal: () => void,
  navigation: NavigationScreenProp<*>,
  t: TFunction
}

class FeedbackModal extends React.Component<PropsType> {
  render () {
    const {theme, t} = this.props

    return <Wrapper theme={theme}>
      <Caption theme={theme} title={t('feedback')} />
    </Wrapper>
  }
}

export default FeedbackModal
