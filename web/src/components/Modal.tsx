import { styled, useTheme } from '@mui/material/styles'
import FocusTrap from 'focus-trap-react'
import React, { CSSProperties, ReactElement, ReactNode, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import useLockedBody from '../hooks/useLockedBody'
import useScrollToTop from '../hooks/useScrollToTop'
import useWindowDimensions from '../hooks/useWindowDimensions'
import { LAYOUT_ELEMENT_ID, RichLayout } from './Layout'
import ModalContent from './ModalContent'
import Portal from './Portal'
import Button from './base/Button'

const Overlay = styled(Button)`
  position: absolute;
  inset: 0;
  background-color: ${props =>
    props.theme.isContrastTheme
      ? props.theme.legacy.colors.backgroundAccentColor
      : props.theme.legacy.colors.textSecondaryColor};
  opacity: 0.9;
  width: 100%;
  height: 100%;
`

const ModalContainer = styled('div')`
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ModalContentContainer = styled('div')`
  position: relative;
  display: flex;
  flex-direction: column;

  ${props => props.theme.breakpoints.down('md')} {
    height: 100%;
    align-items: center;
    width: 100%;
  }
`

type ModalProps = {
  title: string
  icon?: ReactElement
  contentStyle?: CSSProperties
  children: ReactNode
  closeModal: () => void
  wrapInPortal?: boolean
}

const Modal = ({ title, icon, contentStyle, closeModal, children, wrapInPortal = false }: ModalProps): ReactElement => {
  const { mobile } = useWindowDimensions()
  const { t } = useTranslation('common')
  useScrollToTop()
  useLockedBody(true)

  useEffect(() => {
    const layoutElement = document.getElementById(LAYOUT_ELEMENT_ID)
    layoutElement?.setAttribute('aria-hidden', 'true')

    return () => layoutElement?.setAttribute('aria-hidden', 'false')
  }, [])

  const { contentDirection } = useTheme()

  // display check option is needed for portals - https://github.com/focus-trap/tabbable/blob/master/CHANGELOG.md#600
  const Modal = (
    <FocusTrap focusTrapOptions={{ clickOutsideDeactivates: true, tabbableOptions: { displayCheck: 'legacy-full' } }}>
      <ModalContainer role='dialog' aria-hidden={false} aria-modal>
        <Overlay onClick={closeModal} tabIndex={0} label={t('close')}>
          <div />
        </Overlay>
        <ModalContentContainer>
          <ModalContent title={title} style={contentStyle} icon={icon} closeModal={closeModal} small={mobile}>
            {children}
          </ModalContent>
        </ModalContentContainer>
      </ModalContainer>
    </FocusTrap>
  )

  if (wrapInPortal) {
    return (
      <Portal className='modal' show>
        <RichLayout>
          <div dir={contentDirection}>{Modal}</div>
        </RichLayout>
      </Portal>
    )
  }

  return Modal
}

export default Modal
