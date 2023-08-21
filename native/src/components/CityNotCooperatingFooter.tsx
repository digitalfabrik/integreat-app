import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import buildConfig, { buildConfigAssets } from '../constants/buildConfig'
import Icon from './base/Icon'
import TextButton from './base/TextButton'

const FooterContainer = styled.View`
  background-color: ${props => props.theme.colors.backgroundAccentColor};
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 2px solid ${props => props.theme.colors.textColor};
  padding-top: 5%;
`

const Question = styled.Text`
  margin-top: 5%;
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
  font-size: 16px;
`

const StyledButton = styled(TextButton)`
  width: 40%;
  margin: 30px 0 40px 0;
`

type CityNotCooperatingFooterProps = {
  navigateToCityNotCooperating: () => void
}

const CityNotCooperatingFooter = ({
  navigateToCityNotCooperating,
}: CityNotCooperatingFooterProps): ReactElement | null => {
  const { t } = useTranslation('landing')

  const CityNotCooperatingIcon = buildConfigAssets().CityNotCooperatingIcon

  if (!buildConfig().featureFlags.cityNotCooperating || !CityNotCooperatingIcon) {
    return null
  }

  return (
    <FooterContainer>
      <Icon Icon={CityNotCooperatingIcon} width='30%' height='100' />
      <Question>{t('cityNotFound')}</Question>
      <StyledButton text={t('clickHere')} onPress={navigateToCityNotCooperating} />
    </FooterContainer>
  )
}

export default CityNotCooperatingFooter
