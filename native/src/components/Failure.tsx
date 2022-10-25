import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Text } from 'react-native'
import { Button } from 'react-native-elements'
import styled, { useTheme } from 'styled-components/native'

import { ErrorCode } from 'api-client'

import NoInternetIcon from '../assets/no-internet.svg'
import SadIcon from '../assets/smile-sad.svg'
import UnknownIcon from '../assets/warning.svg'

const ViewContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  margin-bottom: 15%;
`
const IconContainer = styled.Image`
  margin-bottom: 10px;
`

export type FailureProps = {
  code: ErrorCode
  tryAgain?: () => void
}

const Failure = ({ code, tryAgain }: FailureProps): ReactElement => {
  const { t } = useTranslation('error')
  const theme = useTheme()
  let errorIcon
  switch (code) {
    case ErrorCode.NetworkConnectionFailed: {
      errorIcon = NoInternetIcon
      break
    }
    case ErrorCode.UnknownError: {
      errorIcon = UnknownIcon
      break
    }
    default: {
      errorIcon = SadIcon
      break
    }
  }
  return (
    <ViewContainer>
      <IconContainer source={errorIcon} />
      <Text>{t(code)}</Text>
      {tryAgain && (
        <Button
          testID='button-tryAgain'
          titleStyle={{
            color: theme.colors.textColor,
          }}
          buttonStyle={{
            backgroundColor: theme.colors.themeColor,
            marginTop: 40,
          }}
          onPress={tryAgain}
          title={t('tryAgain')}
        />
      )}
    </ViewContainer>
  )
}

export default Failure
