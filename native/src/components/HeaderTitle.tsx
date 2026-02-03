import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import { TouchableRipple } from 'react-native-paper'

import buildConfig from '../constants/buildConfig'
import Icon from './base/Icon'
import Text from './base/Text'

const LONG_TITLE_LENGTH = 25

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
  },
})

type HeaderTitleProps = {
  title?: string
  language?: string
  landingPath?: () => void
}

const HeaderTitle = ({ title, language, landingPath }: HeaderTitleProps): ReactElement | undefined => {
  const variant = !!title && title.length >= LONG_TITLE_LENGTH ? 'subtitle2' : 'subtitle1'

  if (buildConfig().featureFlags.fixedCity || !landingPath) {
    return <Text variant={variant}>{title}</Text>
  }

  if (title) {
    return (
      <TouchableRipple style={styles.touchableRippleStyle} borderless onPress={landingPath}>
        <View style={styles.titleTextContainer}>
          <Text
            variant={variant}
            allowFontScaling={false}
            numberOfLines={0}
            accessibilityLanguage={language}
            style={{ flexShrink: 1 }}>
            {title}
          </Text>
          <Icon source='chevron-down' size={24} />
        </View>
      </TouchableRipple>
    )
  }

  return undefined
}

export default HeaderTitle
