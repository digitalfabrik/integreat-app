import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import FocusTrap from 'focus-trap-react'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { POSITIVE_RATING } from 'api-client'

import dimensions from '../constants/dimensions'
import { faTimes } from '../constants/icons'
import { RouteType } from '../routes'
import FeedbackContainer from './FeedbackContainer'
import { FeedbackRatingType } from './FeedbackToolbarItem'

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
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
  }
`
const Header = styled.div`
  display: flex;
  width: 360px;
  padding: 20px;
  flex-direction: row;
  justify-content: space-between;
  font-size: ${props => props.theme.fonts.subTitleFontSize};
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
  path?: string
  alias?: string
  cityCode: string
  language: string
  routeType: RouteType
  feedbackRating: FeedbackRatingType
  closeModal: () => void
}

const FeedbackModal = (props: FeedbackModalProps): ReactElement => {
  const { feedbackRating, closeModal, ...otherProps } = props
  const { t } = useTranslation('feedback')

  return (
    <FocusTrap focusTrapOptions={{ clickOutsideDeactivates: true }}>
      <ModalContainer role='dialog' aria-modal>
        <Overlay onClick={closeModal} role='button' tabIndex={0} onKeyPress={closeModal} />
        <ModalContent>
          <Header>
            <div>{t('feedback')}</div>
            <CloseButton aria-label={t('close')} onClick={closeModal}>
              <FontAwesomeIcon icon={faTimes} />
            </CloseButton>
          </Header>
          <FeedbackContainer
            isPositiveFeedback={feedbackRating === POSITIVE_RATING}
            isSearchFeedback={false}
            closeModal={closeModal}
            {...otherProps}
          />
        </ModalContent>
      </ModalContainer>
    </FocusTrap>
  )
}

export default FeedbackModal
