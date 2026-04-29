import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, useTheme } from 'react-native-paper'
import styled from 'styled-components/native'

import buildConfig, { buildConfigAssets } from '../constants/buildConfig'
import Icon from './base/Icon'
import Text from './base/Text'

const FooterContainer = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5% 24px 0;
`

const StyledIcon = styled(Icon)`
  height: 100px;
  width: 35%;
`

type SuggestToRegionFooterProps = {
  navigateToSuggestToRegion: () => void
}

const SuggestToRegionFooter = ({ navigateToSuggestToRegion }: SuggestToRegionFooterProps): ReactElement | null => {
  const { t } = useTranslation('landing')
  const theme = useTheme()

  const SuggestToRegionIcon = buildConfigAssets().SuggestToRegionIcon

  if (!buildConfig().featureFlags.suggestToRegion || !SuggestToRegionIcon) {
    return null
  }

  return (
    <FooterContainer>
      <StyledIcon Icon={SuggestToRegionIcon} />
      <Text variant='h5' style={{ marginTop: '5%' }}>
        {t('regionNotFound')}
      </Text>
      <Button
        mode='outlined'
        style={{
          marginTop: 28,
          marginBottom: 40,
          paddingVertical: 4,
          paddingHorizontal: 8,
          borderRadius: 4,
          borderColor: theme.colors.primary,
        }}
        onPress={navigateToSuggestToRegion}>
        {t('suggestToRegion', { appName: buildConfig().appName })}
      </Button>
    </FooterContainer>
  )
}

export default SuggestToRegionFooter
