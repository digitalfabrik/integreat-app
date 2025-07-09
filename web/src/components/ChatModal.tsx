import styled from '@emotion/styled'
import FocusTrap from 'focus-trap-react'
import React, { ReactElement, ReactNode, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import ChatModalContent from './ChatContentWrapper'
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
  ${props => props.theme.breakpoints.up('md')} {
    margin-inline-end: 20px;
  }

  position: relative;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.backgroundColor};
  border-radius: 5px;

  ${props => props.theme.breakpoints.down('md')} {
    height: 100%;
    align-items: center;
    width: 100%;
  }
`

type ChatModalProps = {
  title: string
  children: ReactNode
  closeModal: () => void
}

const ChatModal = ({ title, closeModal, children }: ChatModalProps): ReactElement => {
  const { t } = useTranslation('common')

  useEffect(() => {
    const layoutElement = document.getElementById(LAYOUT_ELEMENT_ID)
    layoutElement?.setAttribute('aria-hidden', 'true')

    return () => layoutElement?.setAttribute('aria-hidden', 'false')
  }, [])

  return (
    <FocusTrap focusTrapOptions={{ clickOutsideDeactivates: true, tabbableOptions: { displayCheck: 'legacy-full' } }}>
      <ModalContainer role='dialog' aria-hidden={false} aria-modal>
        <Overlay onClick={closeModal} tabIndex={0} label={t('minimize')}>
          <div />
        </Overlay>
        <ModalContentContainer>
          <ChatModalContent title={title} onClose={closeModal}>
            {children}
          </ChatModalContent>
        </ModalContentContainer>
      </ModalContainer>
    </FocusTrap>
  )
}

export default ChatModal
