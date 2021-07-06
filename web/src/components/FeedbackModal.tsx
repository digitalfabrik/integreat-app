import React, { ReactElement } from 'react'
import { POSITIVE_RATING } from 'api-client'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import FeedbackContainer from './FeedbackContainer'
import FocusTrap from 'focus-trap-react'
import dimensions from '../constants/dimensions'
import { FeedbackRatingType } from './FeedbackToolbarItem'
import { RouteType } from '../routes'
import { faTimes } from '../constants/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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
  z-index: 11;
  display: flex;
  align-items: center;
  justify-content: center;
`
const Feedback = styled.div`
  position: relative;
  display: flex;
  background-color: ${props => props.theme.colors.backgroundColor};

  @media ${dimensions.smallViewport} {
    width: 100%;
    height: 100%;
    align-items: flex-start;
    justify-content: center;
  }
`
const Header = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
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
type PropsType = {
  path?: string
  alias?: string
  cityCode: string
  language: string
  routeType: RouteType
  feedbackRating: FeedbackRatingType
  closeModal: () => void
}


const FeedbackModal = (props: PropsType): ReactElement => {

  const { feedbackRating, closeModal, ...otherProps } = props
  const { t } = useTranslation('feedback')


  const handleOverlayClick = (): void => {
    console.log(props)
    closeModal()
  }

  return (
    <FocusTrap>
      <div>
        <Header>
          <div>{t('feedback')}</div>
          <CloseButton aria-label={t('close')} onClick={closeModal}>
            <FontAwesomeIcon icon={faTimes} />
          </CloseButton>
        </Header>
        <ModalContainer role='dialog' aria-modal>
          <Overlay onClick={handleOverlayClick} />
          <Feedback>
            <FeedbackContainer
              isPositiveFeedback={feedbackRating === POSITIVE_RATING}
              isSearchFeedback={false}
              {...otherProps}
            />
          </Feedback>
        </ModalContainer>
      </div>
    </FocusTrap>
  )

}

export default FeedbackModal
