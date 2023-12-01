import { useFocusEffect } from '@react-navigation/native'
import React, { ReactElement, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, StyleSheet } from 'react-native'
import styled from 'styled-components/native'

import { capitalizeFirstLetter } from 'api-client'

import buildConfig from '../constants/buildConfig'
import appSettings, { ExternalSourcePermission } from '../utils/AppSettings'
import { reportError } from '../utils/sentry'
import Caption from './Caption'
import ConsentSection from './ConsentSection'
import Layout from './Layout'

export const ItemSeparator = styled.View`
  background-color: ${props => props.theme.colors.textDecorationColor};
  height: ${StyleSheet.hairlineWidth}px;
`

const Consent = (): ReactElement | null => {
  const [externalSources, setExternalSources] = useState<ExternalSourcePermission[]>([])
  const { t } = useTranslation('consent')

  useFocusEffect(
    useCallback(() => {
      appSettings.loadExternalSourcePermissions().then(setExternalSources).catch(reportError)
    }, []),
  )

  const onPress = (type: string, allowed: boolean) => {
    const updatedSources = externalSources
    const arrayIndex = externalSources.findIndex(source => source.type === type)
    if (arrayIndex > -1) {
      updatedSources.splice(arrayIndex, 1, { type, allowed })
    } else {
      updatedSources.push({ type, allowed })
    }
    setExternalSources(updatedSources)
    appSettings.setExternalSourcePermissions(updatedSources).catch(reportError)
  }
  const getInitialValue = (src: string): boolean =>
    externalSources.find(source => source.type === src)?.allowed ?? false

  return (
    <Layout>
      <Caption title={t('headline')} />
      <ItemSeparator />
      <View>
        {capitalizeFirstLetter(buildConfig().whiteListedIframeSources).map(src => (
          <ConsentSection
            key={src}
            title={src}
            description={t('consentDescription', { source: src })}
            initialSwitchValue={getInitialValue(src)}
            onPress={onPress}
          />
        ))}
      </View>
    </Layout>
  )
}

export default Consent
