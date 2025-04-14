import React, { ReactElement, ReactNode } from 'react'
import styled from 'styled-components'

import dimensions from '../constants/dimensions'
import { useContrastTheme } from '../hooks/useContrastTheme'
import useWindowDimensions from '../hooks/useWindowDimensions'

const Container = styled.div`
  /* noop */
`

const ToolbarContainer = styled.div<{ $direction: 'row' | 'column'; $hasPadding: boolean; $isContrastTheme: boolean }>`
  display: flex;
  flex-wrap:wrap;
  justify-content:center;
  box-sizing: border-box;
  flex-direction: ${props => props.$direction};
  align-items: center;
  font-family: ${props => props.theme.fonts.web.contentFont};

  & > * {
    font-size: 1.5rem;
    transition: 0.2s opacity;
  }
  
& > *:focus {
    ${props => props.$isContrastTheme && `outline: 2px solid ${props.theme.colors.themeColor}`}
    
  & > *:hover {
    opacity: 1;
  }

  & p {
    margin: 0.5rem 0 0;
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
  hideDivider?: boolean
}

const Toolbar: React.FC<ToolbarProps> = ({
  children,
  className,
  iconDirection = 'column',
  hideDivider = false,
}: ToolbarProps): ReactElement => {
  const { viewportSmall } = useWindowDimensions()
  const { isContrastTheme } = useContrastTheme()
  const hasPadding = iconDirection === 'column'
  return (
    <Container as={viewportSmall ? 'footer' : 'div'}>
      {viewportSmall && !hideDivider && <Divider />}
      <ToolbarContainer
        $isContrastTheme={isContrastTheme}
        className={className}
        $direction={iconDirection}
        $hasPadding={hasPadding}>
        {children}
      </ToolbarContainer>
    </Container>
  )
}

export default Toolbar
