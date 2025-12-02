import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import { ErrorCode } from 'shared/api'

import Icon from './base/Icon'
import TextButton from './base/TextButton'

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
      <Message>{t(code === ErrorCode.CityUnavailable ? 'notFound.city' : code)}</Message>
      {buttonAction && <TextButton onPress={buttonAction} text={t(buttonLabel ?? 'tryAgain')} />}
    </ViewContainer>
  )
}

export default Failure
