import { useFocusEffect } from '@react-navigation/native'
import React, { ReactElement, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { capitalizeFirstLetter } from 'api-client'

import buildConfig from '../constants/buildConfig'
import appSettings, { ExternalSourcePermission } from '../utils/AppSettings'
import { updateSourcePermissions } from '../utils/helpers'
import { reportError } from '../utils/sentry'
import Caption from './Caption'
import ConsentSection from './ConsentSection'
import Layout from './Layout'
import ItemSeparator from './base/ItemSeparator'

const NoItemsMessage = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.contentFontRegular};
  align-self: center;
  margin-top: 20px;
`

const Consent = (): ReactElement | null => {
  const [externalSourcePermissions, setExternalSourcePermissions] = useState<ExternalSourcePermission[] | null>(null)
  const { t } = useTranslation('consent')

  useFocusEffect(
    useCallback(() => {
      appSettings.loadExternalSourcePermissions().then(setExternalSourcePermissions).catch(reportError)
    }, []),
  )
  const onPress = (type: string, allowed: boolean) => {
    if (!externalSourcePermissions) {
      return
    }
    const updatedSources = updateSourcePermissions(externalSourcePermissions, { type, allowed })
    setExternalSourcePermissions(updatedSources)
    appSettings.setExternalSourcePermissions(updatedSources).catch(reportError)
  }

  if (!externalSourcePermissions) {
    return null
  }

  return (
    <Layout>
      <Caption title={t('title')} />
      <ItemSeparator />
      {buildConfig().allowedIframeSources.length > 0 ? (
        <View>
          {capitalizeFirstLetter(buildConfig().allowedIframeSources).map(src => (
            <ConsentSection
              key={src}
              title={src}
              description={t('consentDescription', { source: src })}
              initialSwitchValue={externalSourcePermissions.some(source => source.type === src && source.allowed)}
              onPress={onPress}
            />
          ))}
        </View>
      ) : (
        <NoItemsMessage>{t('noSources')}</NoItemsMessage>
      )}
    </Layout>
  )
}

export default Consent
