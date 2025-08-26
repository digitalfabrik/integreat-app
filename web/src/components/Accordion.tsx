import { styled } from '@mui/material/styles'
import React, { useRef, useEffect, useState, ReactElement } from 'react'

const AccordionWrapper = styled('div')<{ height: number; overflowVisible: boolean }>`
  transition: height 0.3s ease;
  height: ${props => props.height}px;
  width: 100%;
  overflow: ${props => (props.overflowVisible ? 'visible' : 'hidden')};
  padding-top: 1px;
`

type AccordionProps = {
  isOpen: boolean
  children: React.ReactNode
}

const Accordion = ({ isOpen, children }: AccordionProps): ReactElement => {
  const [height, setHeight] = useState(0)
  const [overflowVisible, setOverflowVisible] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0)
      if (!isOpen) {
        setOverflowVisible(false)
      }
    }
  }, [isOpen])

  const handleTransitionEnd = () => {
    if (isOpen) {
      setOverflowVisible(true)
    }
  }

  return (
    <AccordionWrapper
      ref={contentRef}
      height={height}
      overflowVisible={overflowVisible}
      onTransitionEnd={handleTransitionEnd}>
      {children}
    </AccordionWrapper>
  )
}

export default Accordion
