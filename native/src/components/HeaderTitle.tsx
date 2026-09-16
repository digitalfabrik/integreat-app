import { NavigationRoute, ParamListBase } from '@react-navigation/native'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { TouchableRipple } from 'react-native-paper'

import { RoutesParamsType } from '../constants/NavigationTypes'
import buildConfig from '../constants/buildConfig'
import { AppContext } from '../contexts/AppContext'
import Icon from './base/Icon'
import Text from './base/Text'

const styles = StyleSheet.create({
  touchableRippleStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minHeight: 60,
  },
  titleTextContainer: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
})

const getRouteTitle = (route: Partial<NavigationRoute<ParamListBase, string>>): string | undefined => {
  const { state, params } = route
  const focusedRoute = state?.routes[state.index ?? state.routes.length - 1]
  const nestedTitle = focusedRoute ? getRouteTitle(focusedRoute) : undefined
  return nestedTitle ?? (params as { title?: string } | undefined)?.title
}

type HeaderTitleProps = {
  previousRoute: NavigationRoute<RoutesParamsType, keyof RoutesParamsType> | undefined
  regionName: string | undefined
  regionsPath: (() => void) | undefined
}

const HeaderTitle = ({ previousRoute, regionName, regionsPath }: HeaderTitleProps): ReactElement | null => {
  const { languageCode } = useContext(AppContext)
  const { t } = useTranslation()

  const title = previousRoute ? getRouteTitle(previousRoute) : regionName

  if (!title) {
    return null
  }

  if (buildConfig().featureFlags.fixedRegion || !regionsPath) {
    return (
      <Text numberOfLines={2} style={{ flexShrink: 1, marginHorizontal: 2 }} variant='subtitle1'>
        {title}
      </Text>
    )
  }

  return (
    <TouchableRipple
      style={styles.touchableRippleStyle}
      borderless
      onPress={regionsPath}
      accessibilityRole='button'
      accessibilityLabel={`${title} ${t($ => $.regions.change)}`}>
      <View style={styles.titleTextContainer}>
        <Text variant='subtitle1' numberOfLines={2} accessibilityLanguage={languageCode} style={{ flexShrink: 1 }}>
          {title}
        </Text>
        <Icon source='chevron-down' size={24} />
      </View>
    </TouchableRipple>
  )
}

export default HeaderTitle
