import React, { useRef, useEffect, useState, ReactElement } from 'react'
import styled from 'styled-components'

const AccordionWrapper = styled.div<{ height: number; $overflowVisible: boolean }>`
  transition: height 0.3s ease;
  height: ${props => props.height}px;
  width: 100%;
  overflow: ${props => (props.$overflowVisible ? 'visible' : 'hidden')};
`

type AccordionProps = {
  isOpen: boolean
  childrenDependency?: boolean
  children: React.ReactNode
}

const Accordion = ({ isOpen, childrenDependency = true, children }: AccordionProps): ReactElement => {
  const [height, setHeight] = useState(0)
  const [overflowVisible, setOverflowVisible] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const dependency = childrenDependency ? children : null

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0)
      if (!isOpen) {
        setOverflowVisible(false)
      }
    }
  }, [isOpen, dependency])

  const handleTransitionEnd = () => {
    if (isOpen) {
      setOverflowVisible(true)
    }
  }

  return (
    <AccordionWrapper
      ref={contentRef}
      height={height}
      $overflowVisible={overflowVisible}
      onTransitionEnd={handleTransitionEnd}>
      {children}
    </AccordionWrapper>
  )
}

export default Accordion
