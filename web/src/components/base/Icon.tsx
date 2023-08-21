import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { config, UiDirectionType } from 'translations/src'

const StyledIcon = styled.img<{ direction: UiDirectionType; directionDependent: boolean; reverse: boolean }>`
  transform: ${props =>
    (props.reverse === true) !== (props.directionDependent && props.direction === 'rtl') ? 'scaleX(-1)' : ''};
`

type IconProps = {
  src: string
  directionDependent?: boolean
  reverse?: boolean
  className?: string
}

const Icon = ({ src, directionDependent = false, reverse = false, className }: IconProps): ReactElement => {
  const { i18n } = useTranslation()
  return (
    <StyledIcon
      src={src}
      direction={config.getScriptDirection(i18n.language)}
      directionDependent={directionDependent}
      reverse={reverse}
      className={className}
      alt=''
    />
  )
}

export default Icon
