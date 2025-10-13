import { useTheme } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import SVG from 'react-inlinesvg'

const DEFAULT_ICON_SIZE = 24

type CustomIconProps = {
  src: string
  width?: number | string
  height?: number | string
  className?: string
}

const Svg = ({
  src,
  width = DEFAULT_ICON_SIZE,
  height = DEFAULT_ICON_SIZE,
  className,
}: CustomIconProps): ReactElement => {
  const theme = useTheme()
  return <SVG src={src} width={width} height={height} color={theme.palette.text.primary} className={className} />
}

export default Svg
