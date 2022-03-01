import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import SadIcon from '../assets/smile-sad.svg'

const Description = styled.Text`
  display: flex;
  text-align: left;
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
  font-size: 16px;
  text-align: center;
  padding: 10px 30px 30px;
`

const SadIconContainer = styled.Image`
  margin: 0px auto 10px;
`

const NothingFound = (): ReactElement => {
  const { t } = useTranslation('search')
  return (
    <>
      <SadIconContainer source={SadIcon} />
      <Description accessibilityRole='alert'>{t('search:nothingFound')}</Description>
    </>
  )
}

export default NothingFound
