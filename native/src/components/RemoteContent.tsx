import { mapValues } from 'lodash'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useWindowDimensions } from 'react-native'
import { useTheme } from 'styled-components/native'

import { sanitizeContent } from 'shared'

import buildConfig from '../constants/buildConfig'
import dimensions from '../constants/dimensions'
import { useAppContext } from '../hooks/useRegionAppContext'
import useResourceCache from '../hooks/useResourceCache'
import { getStaticServerFileUrl } from '../utils/helpers'
import renderHtml from '../utils/renderHtml'
import { StaticServerContext } from './StaticServerProvider'
import WebView from './WebView'

type RemoteContentProps = {
  content: string
  language: string
  onLoad: () => void
  loading: boolean
}

// If the app crashes without an error message while using RemoteContent, consider wrapping it in a ScrollView or setting a manual height
const RemoteContent = ({ onLoad, content, language, loading }: RemoteContentProps): ReactElement | null => {
  const { data: resourceCache } = useResourceCache()
  const staticServerUrl = useContext(StaticServerContext)
  const { settings } = useAppContext()
  const { width: deviceWidth } = useWindowDimensions()
  const { t } = useTranslation()
  const theme = useTheme()

  const { externalSourcePermissions } = settings

  const resourceMap = mapValues(resourceCache, filePath => getStaticServerFileUrl(filePath, staticServerUrl))

  const sanitizedContent = sanitizeContent(content)

  if (content.length === 0) {
    return null
  }

  return (
    <WebView
      source={{
        baseUrl: staticServerUrl,
        html: renderHtml(
          sanitizedContent,
          resourceMap,
          buildConfig().supportedIframeSources,
          theme,
          language,
          externalSourcePermissions,
          t,
          deviceWidth,
          dimensions.pageContainerPaddingHorizontal,
        ),
      }}
      onLoad={onLoad}
      loading={loading}
    />
  )
}

export default RemoteContent
