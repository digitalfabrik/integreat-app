import React, { ReactElement } from 'react'
import styled from 'styled-components/native'
import { Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import FailureIcon from '../assets/FailureIcon.svg'
import { Button } from 'react-native-elements'
import { ErrorCode } from 'api-client'
import { ThemeType } from 'build-configs'

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
