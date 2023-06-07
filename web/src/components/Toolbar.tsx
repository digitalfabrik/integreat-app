import React, { ReactElement, ReactNode } from 'react'
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

type ToolbarProps = {
  className?: string
  children?: ReactNode
  iconDirection?: 'row' | 'column'
}

const Toolbar: React.FC<ToolbarProps> = ({
  children,
  className,
  iconDirection = 'column',
}: ToolbarProps): ReactElement => {
  const hasPadding = iconDirection === 'column'
  return (
    <div>
      <ToolbarContainer className={className} direction={iconDirection} hasPadding={hasPadding}>
        {children}
      </ToolbarContainer>
    </div>
  )
}

export default Toolbar
