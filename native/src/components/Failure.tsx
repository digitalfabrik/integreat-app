import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import { ErrorCode } from 'api-client'

import NoInternetIcon from '../assets/no-internet.svg'
import SadIcon from '../assets/smile-sad.svg'
import UnknownIcon from '../assets/warning.svg'
import PrimaryTextButton from './PrimaryTextButton'

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
      {buttonAction && <PrimaryTextButton onPress={buttonAction} text={t(buttonLabel ?? 'tryAgain')} />}
    </ViewContainer>
  )
}

export default Failure
