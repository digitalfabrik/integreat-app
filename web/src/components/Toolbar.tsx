import { css } from '@emotion/react'
import styled from '@emotion/styled'
import React, { ReactElement, ReactNode } from 'react'

import useWindowDimensions from '../hooks/useWindowDimensions'

const Container = styled.div`
  /* noop */
`

const ToolbarContainer = styled.div<{ direction: 'row' | 'column'; hasPadding: boolean }>`
  display: flex;
  box-sizing: border-box;
  flex-direction: ${props => props.direction};
  align-items: center;
  font-family: ${props => props.theme.fonts.web.contentFont};

  ${props =>
    props.direction === 'column' &&
    css`
      max-width: 120px;
      width: max-content;
    `}
  & > * {
    font-size: 1.5rem;
    transition: 0.2s opacity;
  }

  & > *:hover {
    opacity: 1;
  }

  & p {
    margin: 0.5rem 0 0;
  }

  ${props => props.theme.breakpoints.down('md')} {
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
  const hasPadding = iconDirection === 'column'
  return (
    <Container as={viewportSmall ? 'footer' : 'div'}>
      {viewportSmall && !hideDivider && <Divider />}
      <ToolbarContainer className={className} direction={iconDirection} hasPadding={hasPadding}>
        {children}
      </ToolbarContainer>
    </Container>
  )
}

export default Toolbar
