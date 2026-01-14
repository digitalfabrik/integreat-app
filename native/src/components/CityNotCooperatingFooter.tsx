import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import buildConfig, { buildConfigAssets } from '../constants/buildConfig'
import Icon from './base/Icon'
import Text from './base/Text'
import TextButton from './base/TextButton'

const FooterContainer = styled.View`
  background-color: ${props => props.theme.colors.surface};
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 2px solid ${props => props.theme.colors.onSurface};
  padding-top: 5%;
`

const StyledButton = styled(TextButton)`
  margin: 30px 0 40px;
  padding: 8px 16px;
`

const StyledIcon = styled(Icon)`
  height: 100px;
  width: 30%;
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
      <StyledIcon Icon={CityNotCooperatingIcon} />
      <Text variant='h5' style={{ marginTop: '5%' }}>
        {t('cityNotFound')}
      </Text>
      <StyledButton
        text={t('suggestToRegion', { appName: buildConfig().appName })}
        onPress={navigateToCityNotCooperating}
      />
    </FooterContainer>
  )
}

export default CityNotCooperatingFooter
