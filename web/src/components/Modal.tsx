import FocusTrap from 'focus-trap-react'
import React, { ReactElement, ReactNode, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { UiDirectionType } from 'translations'

import { ArrowBackIcon, CloseIcon } from '../assets'
import dimensions from '../constants/dimensions'
import useLockedBody from '../hooks/useLockedBody'
import useScrollToTop from '../hooks/useScrollToTop'
import useWindowDimensions from '../hooks/useWindowDimensions'
import { LAYOUT_ELEMENT_ID, RichLayout } from './Layout'
import Portal from './Portal'
import Icon from './base/Icon'

const Overlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: ${props => props.theme.colors.textSecondaryColor};
  opacity: 0.9;
`

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ModalContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.backgroundColor};

  @media ${dimensions.smallViewport} {
    height: 100%;
    align-items: center;
    width: 100%;
  }
`

const Header = styled.div<{ flexDirection: string }>`
  display: flex;
  padding: 16px;
  flex-direction: ${props => props.flexDirection};
  justify-content: space-between;
  font-size: ${props => props.theme.fonts.subTitleFontSize};
  font-weight: 700;

  @media ${dimensions.smallViewport} {
    align-self: flex-start;
    gap: 16px;
  }
`

const CloseButton = styled.button`
  background-color: ${props => props.theme.colors.backgroundColor};
  border: none;
  padding: 0;
  cursor: pointer;
`

const StyledIcon = styled(Icon)`
  width: 24px;
  height: 24px;
`

type ModalProps = {
  title: string
  children: ReactNode
  closeModal: () => void
  direction: UiDirectionType
  wrapInPortal?: boolean
}

const Modal = ({ title, closeModal, children, direction, wrapInPortal = false }: ModalProps): ReactElement => {
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
    <FocusTrap focusTrapOptions={{ clickOutsideDeactivates: true }}>
      <ModalContainer role='dialog' aria-hidden={false} aria-modal>
        <Overlay onClick={closeModal} role='button' tabIndex={0} onKeyPress={closeModal} aria-label={t('close')} />
        <ModalContent>
          <Header flexDirection={viewportSmall ? 'row-reverse' : 'row'}>
            <span>{title}</span>
            <CloseButton aria-label={t('close')} onClick={closeModal}>
              <StyledIcon src={viewportSmall ? ArrowBackIcon : CloseIcon} directionDependent />
            </CloseButton>
          </Header>
          {children}
        </ModalContent>
      </ModalContainer>
    </FocusTrap>
  )

  if (wrapInPortal) {
    return (
      <Portal className='modal' show>
        <RichLayout>
          <div dir={direction}>{Modal}</div>
        </RichLayout>
      </Portal>
    )
  }

  return Modal
}

export default Modal
