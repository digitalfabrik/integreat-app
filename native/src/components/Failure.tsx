import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Text } from 'react-native'
import { Button } from 'react-native-elements'
import styled from 'styled-components/native'

import { ErrorCode } from 'api-client'
import { ThemeType } from 'build-configs'

import FailureIcon from '../assets/FailureIcon.svg'

const ViewContainer = styled.View`
  flex: 1;
  align-items: center;
  margin-top: 15%;
`
const IconContainer = styled.Image`
  margin-bottom: 10px;
`

export type PropsType = {
  code: ErrorCode
  tryAgain?: () => void
  theme: ThemeType
}

const Failure = ({ code, tryAgain, theme }: PropsType): ReactElement => {
  const { t } = useTranslation('error')
  return (
    <ViewContainer>
      <IconContainer source={FailureIcon} />
      <Text>{t(code)}</Text>
      {tryAgain && (
        <Button
          testID='button-tryAgain'
          titleStyle={{
            color: theme.colors.textColor
          }}
          buttonStyle={{
            backgroundColor: theme.colors.themeColor,
            marginTop: 20
          }}
          onPress={tryAgain}
          title={t('tryAgain')}
        />
      )}
    </ViewContainer>
  )
}

export default Failure
