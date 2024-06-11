import FocusTrap from 'focus-trap-react'
import React, { ReactElement, ReactNode, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import dimensions from '../constants/dimensions'
import useWindowDimensions from '../hooks/useWindowDimensions'
import { ChatbotVisibilityStatus } from './ChatbotContainer'
import ChatbotModalContent from './ChatbotContentWrapper'
import { LAYOUT_ELEMENT_ID } from './Layout'
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
  @media ${dimensions.mediumLargeViewport} {
    margin-inline-end: 20px;
  }

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

type ChatBotModalProps = {
  title: string
  children: ReactNode
  closeModal: () => void
  visibilityStatus: ChatbotVisibilityStatus
  resizeModal: () => void
}

const ChatbotModal = ({
  title,
  closeModal,
  children,
  visibilityStatus,
  resizeModal,
}: ChatBotModalProps): ReactElement => {
  const { viewportSmall } = useWindowDimensions()
  const { t } = useTranslation('common')

  useEffect(() => {
    const layoutElement = document.getElementById(LAYOUT_ELEMENT_ID)
    layoutElement?.setAttribute('aria-hidden', 'true')

    return () => layoutElement?.setAttribute('aria-hidden', 'false')
  }, [])

  const Modal = (
    <FocusTrap focusTrapOptions={{ clickOutsideDeactivates: true, tabbableOptions: { displayCheck: 'legacy-full' } }}>
      <ModalContainer role='dialog' aria-hidden={false} aria-modal>
        <Overlay onClick={resizeModal} tabIndex={0} ariaLabel={t('close')}>
          <div />
        </Overlay>
        <ModalContentContainer>
          <ChatbotModalContent
            title={title}
            onClose={closeModal}
            small={viewportSmall}
            onResize={resizeModal}
            visibilityStatus={visibilityStatus}>
            {children}
          </ChatbotModalContent>
        </ModalContentContainer>
      </ModalContainer>
    </FocusTrap>
  )

  return Modal
}

export default ChatbotModal
