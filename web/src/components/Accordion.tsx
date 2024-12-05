import React, { useRef, useEffect, useState, ReactElement } from 'react'
import styled from 'styled-components'

const AccordionWrapper = styled.div<{ height: number }>`
  overflow: hidden;
  transition: height 0.3s ease;
  height: ${props => props.height}px;
  width: 100%;
`

type AccordionProps = {
  isOpen: boolean
  children: React.ReactNode
}

const Accordion = ({ isOpen, children }: AccordionProps): ReactElement => {
  const [height, setHeight] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0)
    }
  }, [isOpen, children])

  return (
    <AccordionWrapper ref={contentRef} height={height}>
      {children}
    </AccordionWrapper>
  )
}

export default Accordion
