import { NavigationAction } from '@react-navigation/native'
import React, { ReactElement, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, StyleSheet } from 'react-native'
import { Switch, TouchableRipple } from 'react-native-paper'
import styled from 'styled-components/native'

import { JpalTrackingRouteType } from 'shared'

import Caption from '../components/Caption'
import Layout from '../components/Layout'
import Link from '../components/Link'
import Text from '../components/base/Text'
import { NavigationProps } from '../constants/NavigationTypes'
import buildConfig from '../constants/buildConfig'
import { useAppContext } from '../hooks/useCityAppContext'
import useOnBackNavigation from '../hooks/useOnBackNavigation'

const moreInformationUrl = 'https://integrationevaluation.wordpress.com'

const PaddedContainer = styled.View`
  padding: 40px;
`

const styles = StyleSheet.create({
  descriptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 15,
    paddingBottom: 5,
  },
})

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

        <TouchableRipple role='button' onPress={toggleTrackingEnabled} style={styles.descriptionContainer}>
          <>
            <Text
              variant='body2'
              style={{
                display: 'flex',
                textAlign: 'left',
                paddingVertical: 12,
              }}>
              {t('allowTracking')}
            </Text>
            <Switch value={!!trackingEnabled} onValueChange={toggleTrackingEnabled} />
          </>
        </TouchableRipple>

        <Link url={moreInformationUrl}>{t('trackingMoreInformation')}</Link>
      </PaddedContainer>
    </Layout>
  )
}

export default JpalTracking
