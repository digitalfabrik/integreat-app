import React, { ReactElement } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import BackIcon from '../assets/back-icon.png'
import HeaderContainer from './HeaderContainer'

const BackButton = styled.img`
  width: 20px;
  height: 20px;
  padding: 40px 0 10px 10px;
  cursor: pointer;
`

const BackNavigationHeader = (): ReactElement => {
  const history = useHistory()
  return (
    <HeaderContainer>
      <BackButton alt='backNavigation' src={BackIcon} onClick={() => history.goBack()} />
    </HeaderContainer>
  )
}

export default BackNavigationHeader
