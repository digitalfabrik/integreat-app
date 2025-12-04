import { NavigationAction } from '@react-navigation/native'
import React, { ReactElement, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Text } from 'react-native'
import { Switch } from 'react-native-paper'
import styled from 'styled-components/native'

import { JpalTrackingRouteType } from 'shared'

import Caption from '../components/Caption'
import Layout from '../components/Layout'
import Link from '../components/Link'
import Pressable from '../components/base/Pressable'
import { NavigationProps } from '../constants/NavigationTypes'
import buildConfig from '../constants/buildConfig'
import { useAppContext } from '../hooks/useCityAppContext'
import useOnBackNavigation from '../hooks/useOnBackNavigation'

const moreInformationUrl = 'https://integrationevaluation.wordpress.com'

const ThemedText = styled.Text`
  display: flex;
  text-align: left;
  color: ${props => props.theme.colors.onSurface};
  font-family: ${props => props.theme.legacy.fonts.native.decorativeFontRegular};
  padding: 10px 0;
`
const DescriptionContainer = styled(Pressable)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 15px 0 5px;
`

const PaddedContainer = styled.View`
  padding: 40px;
`

export type JpalTrackingProps = {
  navigation: NavigationProps<JpalTrackingRouteType>
}

const JpalTracking = ({ navigation }: JpalTrackingProps): ReactElement => {
  const { settings, updateSettings } = useAppContext()
  const trackingEnabled = settings.jpalTrackingEnabled
  const { t } = useTranslation('settings')

  const toggleTrackingEnabled = () => updateSettings({ jpalTrackingEnabled: !trackingEnabled })

  const onBackNavigation = useCallback(
    (action: NavigationAction) => {
      if (!trackingEnabled) {
        Alert.alert(t('trackingLeaveTitle'), t('trackingLeaveDescription', { appName: buildConfig().appName }), [
          {
            text: t('decline'),
            style: 'destructive',
            onPress: () => {
              updateSettings({ jpalTrackingEnabled: false })
              navigation.dispatch(action)
            },
          },
          {
            text: t('allowTracking'),
            style: 'default',
            onPress: () => updateSettings({ jpalTrackingEnabled: true }),
          },
        ])
      } else {
        navigation.dispatch(action)
      }
    },
    [navigation, trackingEnabled, updateSettings, t],
  )
  useOnBackNavigation(onBackNavigation)

  return (
    <Layout>
      <PaddedContainer>
        <Caption title={t('tracking')} />
        <Text>{t('trackingDescription', { appName: buildConfig().appName })}</Text>

        <DescriptionContainer role='button' onPress={toggleTrackingEnabled}>
          <ThemedText>{t('allowTracking')}</ThemedText>
          <Switch value={!!trackingEnabled} onValueChange={toggleTrackingEnabled} />
        </DescriptionContainer>

        <Link url={moreInformationUrl}>{t('trackingMoreInformation')}</Link>
      </PaddedContainer>
    </Layout>
  )
}

export default JpalTracking
