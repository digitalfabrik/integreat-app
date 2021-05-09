// @flow

import React from 'react'
import styled from 'styled-components/native'
import { type StyledComponent } from 'styled-components'
import { Text } from 'react-native'
import type { TFunction } from 'react-i18next'
import FailureIcon from '../assets/FailureIcon.svg'
import type { ThemeType } from '../../theme/constants'
import { Button } from 'react-native-elements'
import type { ErrorCodeType } from '../ErrorCodes'

const ViewContainer: StyledComponent<{||}, ThemeType, *> = styled.View`
  flex: 1;
  align-items: center;
  margin-top: 15%;
`

const IconContainer = styled.Image`
  margin-bottom: 10px;
`

export type PropsType = {|
  code: ErrorCodeType,
  tryAgain?: () => void,
  t: TFunction,
  theme: ThemeType
|}

class Failure extends React.Component<PropsType> {
  render() {
    const { t, code, tryAgain, theme } = this.props

    return (
      <ViewContainer>
        <IconContainer source={FailureIcon} />
        <Text>{t(code)}</Text>
        {tryAgain && (
          <Button
            testID='button-tryAgain'
            titleStyle={{ color: theme.colors.textColor }}
            buttonStyle={{ backgroundColor: theme.colors.themeColor, marginTop: 20 }}
            onPress={tryAgain}
            title={t('tryAgain')}
          />
        )}
      </ViewContainer>
    )
  }
}

export default Failure
