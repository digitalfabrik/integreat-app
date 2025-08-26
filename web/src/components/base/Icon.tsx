import shouldForwardProp from '@emotion/is-prop-valid'
import { SvgIconProps } from '@mui/material/SvgIcon'
import { styled, useTheme } from '@mui/material/styles'
import React, { ReactElement, ElementType } from 'react'
import SVG from 'react-inlinesvg'

const StyledIcon = styled(SVG, { shouldForwardProp })<{ directionDependent: boolean; reverse: boolean }>`
  transform: ${props =>
    (props.reverse === true) !== (props.directionDependent && props.theme.contentDirection === 'rtl')
      ? 'scaleX(-1)'
      : ''};
  color: ${props => props.theme.legacy.colors.textColor};
  width: 24px;
  height: 24px;

  --theme-color: ${props => props.theme.legacy.colors.themeColor};
`

type IconProps = {
  src: string | ElementType<SvgIconProps>
  directionDependent?: boolean
  reverse?: boolean
  className?: string
  title?: string
  id?: string
}

const Icon = ({ src, directionDependent = false, reverse = false, className, title, id }: IconProps): ReactElement => {
  const theme = useTheme()
  if (typeof src === 'string') {
    return (
      <StyledIcon
        src={src}
        directionDependent={directionDependent}
        reverse={reverse}
        className={className}
        title={title}
        id={id}
      />
    )
  }

  const MuiIcon = src
  const isRtl = theme.contentDirection === 'rtl'
  const shouldFlip = (reverse === true) !== (directionDependent && isRtl)
  return (
    <MuiIcon
      className={className}
      titleAccess={title}
      sx={{
        color: theme.legacy.colors.textColor,
        transform: shouldFlip ? 'scaleX(-1)' : undefined,
        width: 24,
        height: 24,
      }}
    />
  )
}

export default Icon
