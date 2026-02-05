import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'react-native-paper'
import styled from 'styled-components/native'

import { ErrorCode } from 'shared/api'

import Icon from './base/Icon'
import Text from './base/Text'

const ViewContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  margin-bottom: 15%;
`

export type FailureProps = {
  code: ErrorCode
  buttonAction?: () => void
  buttonLabel?: string
}

const Failure = ({ code, buttonAction, buttonLabel }: FailureProps): ReactElement => {
  const { t } = useTranslation('error')
  let ErrorIcon
  switch (code) {
    case ErrorCode.NetworkConnectionFailed: {
      ErrorIcon = 'wifi-off'
      break
    }
    case ErrorCode.UnknownError: {
      ErrorIcon = 'alert-outline'
      break
    }
    default: {
      ErrorIcon = 'emoticon-sad-outline'
      break
    }
  }
  return (
    <ViewContainer>
      <Icon size={150} source={ErrorIcon} />
      <Text style={{ margin: 12 }}>{t(code === ErrorCode.CityUnavailable ? 'notFound.city' : code)}</Text>
      {buttonAction && (
        <Button mode='contained' onPress={buttonAction}>
          {t(buttonLabel ?? 'tryAgain')}
        </Button>
      )}
    </ViewContainer>
  )
}

export default Failure
