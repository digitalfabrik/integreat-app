import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import SadIcon from '../assets/smile-sad.svg'

const Container = styled.View<{ paddingTop: boolean }>`
  padding-top: ${props => (props.paddingTop ? '20px' : 0)};
`

const Description = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
  font-size: 16px;
  text-align: center;
  padding: 10px 30px 30px;
`

const StyledSadIcon = styled(SadIcon)`
  margin: 10px auto;
`

type NothingFoundProps = {
  paddingTop?: boolean
}

const NothingFound = ({ paddingTop = false }: NothingFoundProps): ReactElement => {
  const { t } = useTranslation('search')
  return (
    <Container paddingTop={paddingTop}>
      <StyledSadIcon height={60} width={60} />
      <Description accessibilityRole='alert'>{t('search:nothingFound')}</Description>
    </Container>
  )
}

export default NothingFound
