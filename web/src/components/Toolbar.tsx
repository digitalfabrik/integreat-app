import React, { ReactElement, ReactNode } from 'react'
import { TFunction, withTranslation } from 'react-i18next'
import styled from 'styled-components'

import dimensions from '../constants/dimensions'

const ToolbarContainer = styled.div`
  display: flex;
  width: 75px;
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  padding: 15px 0;

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

type PropsType = {
  className?: string
  children?: ReactNode
  viewportSmall: boolean
  t: TFunction
}

const Toolbar = ({ children, className, t, viewportSmall }: PropsType): ReactElement => (
  <ToolbarContainer className={className}>
    {viewportSmall && <Headline>{t('isThisSiteUseful')}</Headline>}
    {children}
  </ToolbarContainer>
)

export default withTranslation('feedback')(Toolbar)
