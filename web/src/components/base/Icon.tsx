import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import SVG from 'react-inlinesvg'
import styled from 'styled-components'

import { config, UiDirectionType } from 'translations'

const StyledIcon = styled(SVG)<{ direction: UiDirectionType; $directionDependent: boolean; $reverse: boolean }>`
  transform: ${props =>
    (props.$reverse === true) !== (props.$directionDependent && props.direction === 'rtl') ? 'scaleX(-1)' : ''};
  color: ${props => props.theme.colors.textColor};
  width: 24px;
  height: 24px;
`

type IconProps = {
  src: string
  directionDependent?: boolean
  reverse?: boolean
  className?: string
  // WARNING: Updates to the title are not rendered, the original title keeps being displayed!
  // https://github.com/gilbarbara/react-inlinesvg/issues/218
  title?: string
}

const Icon = ({ src, directionDependent = false, reverse = false, className, title }: IconProps): ReactElement => {
  const { i18n } = useTranslation()
  return (
    <StyledIcon
      src={src}
      direction={config.getScriptDirection(i18n.language)}
      $directionDependent={directionDependent}
      $reverse={reverse}
      className={className}
      title={title}
    />
  )
}

export default Icon
