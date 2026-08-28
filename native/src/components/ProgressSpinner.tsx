import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

import Text from './base/Text'

const Container = styled.View`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const ProgressSpinner = (): ReactElement => {
  const { t } = useTranslation()
  const theme = useTheme()
  return (
    <Container>
      <ActivityIndicator size='large' />
      <Text
        accessibilityLiveRegion='assertive'
        accessibilityState={{ busy: true }}
        accessibilityLabel={t($ => $.common.loading)}
        variant='h4'
        style={{
          paddingTop: 24,
          color: theme.colors.onSurface,
        }}>
        {t($ => $.common.loading)}
      </Text>
    </Container>
  )
}

export default ProgressSpinner
