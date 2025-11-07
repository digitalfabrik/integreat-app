import React, { ReactElement } from 'react'
import { ColorValue } from 'react-native'
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
  color?: ColorValue
}

const Icon = ({
  Icon: IconProp,
  label,
  directionDependent = false,
  reverse = false,
  style,
  color,
}: IconProps): ReactElement => {
  const theme = useTheme()

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
        style,
      ]}
      width={style?.width ?? DEFAULT_ICON_SIZE}
      height={style?.height ?? DEFAULT_ICON_SIZE}
      color={color ?? style?.color ?? theme.legacy.colors.textColor}
      accessibilityLabel={label}
    />
  )
}

export default Icon
