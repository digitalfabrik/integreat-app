// @flow

import React from 'react'
import FeedbackBox from './FeedbackBox'
import CityModel from '../../../modules/endpoint/models/CityModel'
import FeedbackButton from './FeedbackLink'
import styled from 'styled-components'
import CleanLink from '../../../modules/common/components/CleanLink'

const Overlay = styled(CleanLink)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: ${props => props.theme.colors.textSecondaryColor};
  z-index: 3;
  opacity: 0.9;
`

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
`

const FeedbackContainer = styled.div`
  position: relative;
  z-index: 4;
  display: flex;
  background-color: ${props => props.theme.colors.backgroundColor};
  
  @media ${props => props.theme.dimensions.smallViewport} {
    width: 100%;
    height: 100%;
    align-items: flex-start;
    justify-content: center;
  }
`

const FeedbackToolbarItem = styled(FeedbackButton)`
  display: inline-block;
  margin: 0 10px;
  padding: 8px;
`

type PropsType = {
  cities: Array<CityModel>,
  city: string,
  language: string,
  id?: number,
  title: string,
  alias?: string,
  query?: string,
  route: string,
  isPositiveRatingSelected: boolean,
  pathname: string,
  isOpen: boolean
}

class FeedbackModal extends React.Component<PropsType> {
  render () {
    const {pathname, isOpen} = this.props
    return (
      <div>
        <FeedbackToolbarItem isPositiveRatingLink pathname={pathname} />
        <FeedbackToolbarItem
          isPositiveRatingLink={false}
          pathname={pathname} />
        <ModalContainer isOpen={isOpen}>
          <FeedbackContainer>
            <FeedbackBox {...this.props} />
          </FeedbackContainer>
          <Overlay to={pathname} />
        </ModalContainer>
      </div>
    )
  }
}

export default FeedbackModal
