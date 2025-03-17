import React, { ReactElement } from 'react'
import { ColorValue, StyleSheet } from 'react-native'
import { SvgProps } from 'react-native-svg'
import { useTheme } from 'styled-components/native'

import { isRTL } from '../../constants/contentDirection'

const DEFAULT_ICON_SIZE = 24

type IconProps = {
  Icon: React.JSXElementConstructor<SvgProps>
  label?: string
  directionDependent?: boolean
  reverse?: boolean
  style?: { width?: number; height?: number; color?: ColorValue }
}

const Icon = ({
  Icon: IconProp,
  label,
  directionDependent = false,
  reverse = false,
  style,
}: IconProps): ReactElement => {
  const theme = useTheme()
  const flatStyle = StyleSheet.flatten(style ?? {})

  return (
    <IconProp
      style={[
        {
          transform: [
            {
              scaleX: reverse !== (directionDependent && isRTL()) ? -1 : 1,
            },
          ],
        },
        flatStyle,
      ]}
      width={flatStyle.width ?? DEFAULT_ICON_SIZE}
      height={flatStyle.height ?? DEFAULT_ICON_SIZE}
      color={flatStyle.color ?? theme.colors.textColor}
      accessibilityLabel={label}
    />
  )
}

export default Icon
