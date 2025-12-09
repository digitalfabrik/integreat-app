import React, { ReactElement } from 'react'
import { ColorValue, View } from 'react-native'
import { Icon as PaperIcon } from 'react-native-paper'
import { SvgProps } from 'react-native-svg'
import { useTheme } from 'styled-components/native'

import { isRTL } from '../../constants/contentDirection'

const DEFAULT_ICON_SIZE = 24

type IconProps = {
  Icon?: React.JSXElementConstructor<SvgProps>
  source?: string
  label?: string
  directionDependent?: boolean
  style?: { width?: number; height?: number; color?: ColorValue }
  color?: ColorValue
  size?: number
}

const Icon = ({
  Icon: IconProp,
  source,
  label,
  directionDependent = false,
  style,
  color,
  size,
}: IconProps): ReactElement | null => {
  const theme = useTheme()
  const defaultColor = theme.legacy.colors.textColor

  if (source) {
    return (
      // Used style here to enable styling margin and padding via styled-components
      <View
        style={[{ transform: [{ scaleX: directionDependent && isRTL() ? -1 : 1 }] }, style]}
        accessibilityLabel={label}>
        <PaperIcon source={source} size={size ?? DEFAULT_ICON_SIZE} color={(color ?? defaultColor) as string} />
      </View>
    )
  }

  if (IconProp) {
    return (
      <IconProp
        style={[{ transform: [{ scaleX: directionDependent && isRTL() ? -1 : 1 }] }, style]}
        width={style?.width ?? DEFAULT_ICON_SIZE}
        height={style?.height ?? DEFAULT_ICON_SIZE}
        color={color ?? style?.color ?? defaultColor}
        accessibilityLabel={label}
      />
    )
  }
  return null
}

export default Icon
