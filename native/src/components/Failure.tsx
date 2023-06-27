import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
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
const Message = styled.Text`
  margin: 10px;
`

export type FailureProps = {
  code: ErrorCode
  buttonAction?: () => void
  buttonLabel?: string
}

const Failure = ({ code, buttonAction, buttonLabel }: FailureProps): ReactElement => {
  const { t } = useTranslation('error')
  const theme = useTheme()
  let ErrorIcon
  switch (code) {
    case ErrorCode.NetworkConnectionFailed: {
      ErrorIcon = NoInternetIcon
      break
    }
    case ErrorCode.UnknownError: {
      ErrorIcon = UnknownIcon
      break
    }
    default: {
      ErrorIcon = SadIcon
      break
    }
  }
  return (
    <ViewContainer>
      <ErrorIcon width={60} height={60} />
      <Message>{t(code === ErrorCode.CityUnavailable ? 'notFound.city' : code)}</Message>
      {buttonAction && (
        <Button
          testID='button-tryAgain'
          titleStyle={{
            color: theme.colors.textColor,
          }}
          buttonStyle={{
            backgroundColor: theme.colors.themeColor,
            marginTop: 40,
          }}
          onPress={buttonAction}
          title={t(buttonLabel ?? 'tryAgain')}
        />
      )}
    </ViewContainer>
  )
}

export default Failure
