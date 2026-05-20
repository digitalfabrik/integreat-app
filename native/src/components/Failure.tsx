import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'react-native-paper'
import styled from 'styled-components/native'

import { NonNullableRouteInformationType, REGIONS_ROUTE } from 'shared'
import { ErrorCode } from 'shared/api'

import { AppContext } from '../contexts/AppContext'
import useNavigate from '../hooks/useNavigate'
import Icon from './base/Icon'
import Text from './base/Text'

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  margin-bottom: 15%;
  gap: 16px;
`

const getErrorIcon = (errorCode: ErrorCode) => {
  switch (errorCode) {
    case ErrorCode.NetworkConnectionFailed:
      return 'wifi-off'
    case ErrorCode.UnknownError:
      return 'alert-outline'
    default:
      return 'emoticon-sad-outline'
  }
}

export type FailureProps = {
  code: ErrorCode
  retry: (() => void) | null
  goTo?: NonNullableRouteInformationType | (() => void)
  goToLabel?: string
}

const Failure = ({ code, retry, goTo, goToLabel }: FailureProps): ReactElement => {
  const { navigateTo, navigation } = useNavigate()
  const { languageCode } = useContext(AppContext)
  const { t } = useTranslation('error')

  const goToAction = goTo ?? (navigation.canGoBack() ? navigation.goBack : { route: REGIONS_ROUTE, languageCode })

  return (
    <Container>
      <Icon size={160} source={getErrorIcon(code)} />
      <Text>{t(code === ErrorCode.RegionUnavailable ? 'notFound.region' : code)}</Text>
      {retry && (
        <Button mode='contained' onPress={retry}>
          {t('tryAgain')}
        </Button>
      )}
      <Button onPress={typeof goToAction === 'function' ? goToAction : () => navigateTo(goToAction)} mode='outlined'>
        {t(goToLabel ?? 'common:back')}
      </Button>
    </Container>
  )
}

export default Failure
