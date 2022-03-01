import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Text } from 'react-native'
import { Button } from 'react-native-elements'
import styled, { useTheme } from 'styled-components/native'

import { ErrorCode } from 'api-client'

import FailureIcon from '../assets/smile-sad.svg'

const ViewContainer = styled.View`
  flex: 1;
  align-items: center;
  margin-top: 15%;
  margin-bottom: 15%;
`
const IconContainer = styled.Image`
  margin-bottom: 10px;
`

export type PropsType = {
  code: ErrorCode
  tryAgain?: () => void
}

const Failure = ({ code, tryAgain }: PropsType): ReactElement => {
  const { t } = useTranslation('error')
  const theme = useTheme()
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
