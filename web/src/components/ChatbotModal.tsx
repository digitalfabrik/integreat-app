import FocusTrap from 'focus-trap-react'
import React, { ReactElement, ReactNode, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { useTheme } from 'styled-components'

import dimensions from '../constants/dimensions'
import useLockedBody from '../hooks/useLockedBody'
import useScrollToTop from '../hooks/useScrollToTop'
import useWindowDimensions from '../hooks/useWindowDimensions'
import ChatbotModalContent from './ChatbotModalContent'
import { LAYOUT_ELEMENT_ID } from './Layout'
import ModalContent from './ModalContent'
import Button from './base/Button'

const Overlay = styled(Button)`
  position: absolute;
  inset: 0;
  background-color: ${props => props.theme.colors.textSecondaryColor};
  opacity: 0.4;
  width: 100%;
  height: 100%;
`

const ModalContainer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

const ModalContentContainer = styled.div`
  margin-right: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.backgroundColor};
  border-radius: 5px;

  @media ${dimensions.smallViewport} {
    height: 100%;
    align-items: center;
    width: 100%;
  }
`

type ModalProps = {
  title: string
  children: ReactNode
  closeModal: () => void
}

const Modal = ({ title, closeModal, children }: ModalProps): ReactElement => {
  const { viewportSmall } = useWindowDimensions()
  const { t } = useTranslation('common')
  useScrollToTop()
  useLockedBody(true)

  useEffect(() => {
    const layoutElement = document.getElementById(LAYOUT_ELEMENT_ID)
    layoutElement?.setAttribute('aria-hidden', 'true')

    return () => layoutElement?.setAttribute('aria-hidden', 'false')
  }, [])

  const Modal = (
    <FocusTrap focusTrapOptions={{ clickOutsideDeactivates: true, tabbableOptions: { displayCheck: 'legacy-full' } }}>
      <ModalContainer role='dialog' aria-hidden={false} aria-modal>
        <Overlay onClick={closeModal} tabIndex={0} ariaLabel={t('close')}>
          <div />
        </Overlay>
        <ModalContentContainer>
          <ChatbotModalContent title={title} closeModal={closeModal} small={viewportSmall}>
            {children}
          </ChatbotModalContent>
        </ModalContentContainer>
      </ModalContainer>
    </FocusTrap>
  )

  return Modal
}

export default Modal
