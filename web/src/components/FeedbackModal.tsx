import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import FocusTrap from 'focus-trap-react'
import React, { ReactElement, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import dimensions from '../constants/dimensions'
import { faTimes } from '../constants/icons'
import useScrollToTop from '../hooks/useScrollToTop'
import useWindowDimensions from '../hooks/useWindowDimensions'
import { RouteType } from '../routes'
import FeedbackContainer from './FeedbackContainer'

const Overlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: ${props => props.theme.colors.textSecondaryColor};
  opacity: 0.9;
`
const ModalContainer = styled.div<{ topPosition: number }>`
  position: fixed;
  top: ${props => props.topPosition}px;
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
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
  }
`
const Header = styled.div`
  display: flex;
  padding: 20px;
  flex-direction: row;
  justify-content: space-between;
  font-size: ${props => props.theme.fonts.subTitleFontSize};
  font-weight: 700;
`

const CloseButton = styled.button`
  background-color: ${props => props.theme.colors.backgroundColor};
  border: none;

  & * {
    font-size: 0.8em;
    vertical-align: baseline;
  }
`

type FeedbackModalProps = {
  slug?: string
  cityCode: string
  language: string
  routeType: RouteType
  visible: boolean
  closeModal: () => void
}

const FeedbackModal = (props: FeedbackModalProps): ReactElement => {
  const { visible, closeModal, ...otherProps } = props
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const { t } = useTranslation('feedback')
  const headline = isSubmitted ? `${t('thanksHeadline')}` : `${t('headline')}`
  const { viewportSmall } = useWindowDimensions()
  useScrollToTop()

  useLayoutEffect(() => {
    // document.getElementById('feedback-modal-container')?.scrollIntoView({ behavior: 'auto' })
  }, [visible])

  return (
    <FocusTrap focusTrapOptions={{ clickOutsideDeactivates: true }}>
      <ModalContainer
        role='dialog'
        aria-modal
        topPosition={viewportSmall ? dimensions.headerHeightSmall : 0}
        id='feedback-modal-container'>
        <Overlay onClick={closeModal} role='button' tabIndex={0} onKeyPress={closeModal} />
        <ModalContent>
          <Header>
            <div>{headline}</div>
            <CloseButton aria-label={t('close')} onClick={closeModal}>
              <FontAwesomeIcon icon={faTimes} />
            </CloseButton>
          </Header>
          <FeedbackContainer
            isSearchFeedback={false}
            closeModal={closeModal}
            {...otherProps}
            onSubmitted={setIsSubmitted}
          />
        </ModalContent>
      </ModalContainer>
    </FocusTrap>
  )
}

export default FeedbackModal
