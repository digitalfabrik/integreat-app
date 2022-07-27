import React, { ReactElement, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import dimensions from '../constants/dimensions'

const ToolbarContainer = styled.div<{ direction: 'row' | 'column'; hasPadding: boolean }>`
  display: flex;
  box-sizing: border-box;
  flex-direction: ${props => props.direction};
  align-items: center;
  ${props => props.hasPadding && `padding: 15px 0;`};

  & > * {
    opacity: 0.7;
    font-size: 1.5rem;
    transition: 0.2s opacity;
  }

  & > *:hover {
    opacity: 1;
  }

  @media ${dimensions.smallViewport} {
    width: 100%;
    flex-flow: row wrap;
    justify-content: center;
  }
`

const Headline = styled.h5`
  width: 100vw;
  margin: 0;
  text-align: center;
  font-size: 90%;
`

type ToolbarProps = {
  className?: string
  children?: ReactNode
  viewportSmall: boolean
  iconDirection?: 'row' | 'column'
}

const Toolbar: React.FC<ToolbarProps> = ({
  children,
  className,
  viewportSmall,
  iconDirection = 'column',
}: ToolbarProps): ReactElement => {
  const { t } = useTranslation('feedback')
  const hasPadding = iconDirection === 'column'
  return (
    <div>
      <ToolbarContainer className={className} direction={iconDirection} hasPadding={hasPadding}>
        {viewportSmall && <Headline>{t('isThisSiteUseful')}</Headline>}
        {children}
      </ToolbarContainer>
    </div>
  )
}

export default Toolbar
