import React, { ReactElement } from 'react'
import { ViewStyle } from 'react-native'
import { FAB, useTheme } from 'react-native-paper'
import styled from 'styled-components/native'

import { CATEGORIES_ROUTE, getChatName } from 'shared'

import buildConfig from '../constants/buildConfig'
import useRegionAppContext from '../hooks/useRegionAppContext'
import openExternalUrl from '../utils/openExternalUrl'
import urlFromRouteInformation from '../utils/url'

const StyledFab = styled(FAB)`
  position: absolute;
  right: 0;
  margin: 16px;
`

type ChatFabProps = {
  style?: ViewStyle
}

const ChatFab = ({ style }: ChatFabProps): ReactElement => {
  const { regionCode, languageCode } = useRegionAppContext()
  const theme = useTheme()

  return (
    <StyledFab
      icon='forum-outline'
      onPress={() =>
        openExternalUrl(
          urlFromRouteInformation({
            route: CATEGORIES_ROUTE,
            regionCode,
            languageCode,
            chat: true,
            regionContentPath: `/${regionCode}/${languageCode}`,
          }),
          () => {},
        )
      }
      accessibilityLabel={getChatName(buildConfig().appName)}
      variant='primary'
      style={{ ...style, backgroundColor: theme.colors.primary }}
      size='medium'
    />
  )
}

export default ChatFab
