import React, { ReactElement, ReactNode } from 'react'
import styled from 'styled-components'

import dimensions from '../constants/dimensions'

const ToolbarContainer = styled.div<{ direction: 'row' | 'column'; hasPadding: boolean }>`
  display: flex;
  box-sizing: border-box;
  flex-direction: ${props => props.direction};
  align-items: center;
  font-family: ${props => props.theme.fonts.web.contentFont};

  & > * {
    font-size: 1.5rem;
    transition: 0.2s opacity;
  }

  & > *:hover {
    opacity: 1;
  }

  & p {
    margin: 0.5rem 0 0 0;
  }

  @media ${dimensions.smallViewport} {
    width: 100%;
    flex-flow: row wrap;
    justify-content: center;
  }
`

const Divider = styled.hr`
  margin: 12px 24px;
  background-color: ${props => props.theme.colors.borderColor};
  height: 1px;
  border: none;
`

type ToolbarProps = {
  className?: string
  children?: ReactNode
  iconDirection?: 'row' | 'column'
  hasDivider: boolean
}

const Toolbar: React.FC<ToolbarProps> = ({
  children,
  className,
  iconDirection = 'column',
  hasDivider,
}: ToolbarProps): ReactElement => {
  const hasPadding = iconDirection === 'column'
  return (
    <>
      {hasDivider && <Divider />}
      <ToolbarContainer className={className} direction={iconDirection} hasPadding={hasPadding}>
        {children}
      </ToolbarContainer>
    </>
  )
}

export default Toolbar
