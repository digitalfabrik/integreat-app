import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'react-native-paper'
import styled from 'styled-components/native'

import buildConfig, { buildConfigAssets } from '../constants/buildConfig'
import Icon from './base/Icon'
import Text from './base/Text'

const FooterContainer = styled.View`
  background-color: ${props => props.theme.colors.surface};
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 2px solid ${props => props.theme.colors.onSurface};
  padding-top: 5%;
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
      <Button
        mode='outlined'
        style={{
          marginTop: 28,
          marginBottom: 40,
          paddingVertical: 8,
          paddingHorizontal: 16,
        }}
        onPress={navigateToCityNotCooperating}>
        {t('suggestToRegion', { appName: buildConfig().appName })}
      </Button>
    </FooterContainer>
  )
}

export default CityNotCooperatingFooter
