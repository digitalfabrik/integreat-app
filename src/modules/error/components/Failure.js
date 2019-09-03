// @flow

import React from 'react'
import styled, { type StyledComponent } from 'styled-components/native'
import { Text } from 'react-native'
import type { TFunction } from 'react-i18next'
import FailureIcon from '../assets/FailureIcon.svg'
import type { ThemeType } from '../../theme/constants/theme'
import { Button } from 'react-native-elements'

const ViewContainer: StyledComponent<{}, ThemeType, *> = styled.View`
flex: 1;
align-items: center;
margin-top: 15%;
`

const IconContainer = styled.Image`
margin-bottom: 10px;
`

type PropsType = {|
  error?: ?Error,
  tryAgain?: () => void,
  t: TFunction,
  theme: ThemeType
|}

class Failure extends React.Component<PropsType> {
  render () {
    const { t, error, tryAgain, theme } = this.props

    return <ViewContainer>
      <IconContainer source={FailureIcon} />
      <Text>{error ? error.message : t('generalError')}</Text>
      {tryAgain &&
      <Button testID='button-tryAgain' titleStyle={{ color: theme.colors.textColor }}
              buttonStyle={{ backgroundColor: theme.colors.themeColor, marginTop: 20 }}
              onPress={tryAgain} title={t('tryAgain')} />}
    </ViewContainer>
  }
}

export default Failure
