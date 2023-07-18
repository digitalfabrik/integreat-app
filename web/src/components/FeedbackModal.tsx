import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import FocusTrap from 'focus-trap-react'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import dimensions from '../constants/dimensions'
import { faChevronLeft, faTimes } from '../constants/icons'
import useLockedBody from '../hooks/useLockedBody'
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
    height: 100%;
    align-items: center;
    justify-content: center;
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
  }
`

const CloseButton = styled.button`
  background-color: ${props => props.theme.colors.backgroundColor};
  border: none;
  padding: 0;

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
  closeModal: () => void
  topPosition?: number
}

const FeedbackModal = (props: FeedbackModalProps): ReactElement => {
  const { viewportSmall } = useWindowDimensions()
  const { closeModal, topPosition = viewportSmall ? dimensions.headerHeightSmall : 0, ...otherProps } = props
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const { t } = useTranslation('feedback')
  const headline = isSubmitted ? `${t('thanksHeadline')}` : `${t('headline')}`
  useScrollToTop()
  useLockedBody(true)

  return (
    <FocusTrap focusTrapOptions={{ clickOutsideDeactivates: true }}>
      <ModalContainer role='dialog' aria-hidden={false} aria-modal topPosition={topPosition}>
        <Overlay onClick={closeModal} role='button' tabIndex={0} onKeyPress={closeModal} />
        <ModalContent>
          <Header flexDirection={viewportSmall ? 'row-reverse' : 'row'}>
            <span>{headline}</span>
            <CloseButton aria-label={t('close')} onClick={closeModal}>
              <FontAwesomeIcon
                icon={viewportSmall ? faChevronLeft : faTimes}
                style={{ marginRight: viewportSmall ? '15vw' : '0' }}
              />
            </CloseButton>
          </Header>
          <FeedbackContainer
            isSearchFeedback={false}
            closeModal={closeModal}
            {...otherProps}
            onSubmit={() => setIsSubmitted(true)}
          />
        </ModalContent>
      </ModalContainer>
    </FocusTrap>
  )
}

export default FeedbackModal
