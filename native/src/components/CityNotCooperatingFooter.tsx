import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import buildConfig, { buildConfigAssets } from '../constants/buildConfig'
import PrimaryTextButton from './PrimaryTextButton'

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

const ButtonContainer = styled.View`
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

  if (!buildConfig().featureFlags.cityNotCooperating) {
    return null
  }
  const CityNotCooperatingIcon = buildConfigAssets().CityNotCooperatingIcon!

  return (
    <FooterContainer>
      <CityNotCooperatingIcon width='30%' height='100' />
      <Question>{t('cityNotFound')}</Question>
      <ButtonContainer>
        <PrimaryTextButton text={t('clickHere')} onPress={navigateToCityNotCooperating} />
      </ButtonContainer>
    </FooterContainer>
  )
}

export default CityNotCooperatingFooter
