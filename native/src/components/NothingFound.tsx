import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import { SadSmileyIcon } from '../assets'
import Icon from './base/Icon'

const Container = styled.View<{ paddingTop: boolean }>`
  padding-top: ${props => (props.paddingTop ? '20px' : 0)};
`

const Description = styled.Text`
  color: ${props => props.theme.legacy.colors.textColor};
  font-family: ${props => props.theme.legacy.fonts.native.decorativeFontRegular};
  font-size: 16px;
  text-align: center;
  padding: 10px 30px;
`

const StyledIcon = styled(Icon)`
  margin: 10px auto;
  width: 60px;
  height: 60px;
`

type NothingFoundProps = {
  paddingTop?: boolean
}

const NothingFound = ({ paddingTop = false }: NothingFoundProps): ReactElement => {
  const { t } = useTranslation('search')
  return (
    <Container paddingTop={paddingTop}>
      <StyledIcon Icon={SadSmileyIcon} />
      <Description role='alert'>{t('search:nothingFound')}</Description>
    </Container>
  )
}

export default NothingFound
