import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'
import { Chip, useTheme } from 'react-native-paper'
import styled from 'styled-components/native'

import { PoiModel } from 'shared/api'

import { NotAccessibleIcon } from '../assets'
import SimpleImage from './SimpleImage'
import Icon from './base/Icon'
import Text from './base/Text'

const ChipsContainer = styled.View`
  flex-flow: row wrap;
  gap: 8px;
`

const ChipCategoryIcon = styled(SimpleImage)`
  color: ${props => props.theme.colors.onSurface};
  width: 24px;
  height: 24px;
  margin-inline-start: 8px;
`

const StyledIcon = styled(Icon)`
  margin-inline-start: 8px;
  color: ${props => props.theme.colors.onSurface};
`

const PoiChips = ({ poi }: { poi: PoiModel }): ReactElement => {
  const theme = useTheme()
  const { t } = useTranslation()

  const styles = StyleSheet.create({
    chip: {
      borderRadius: 32,
      borderColor: theme.colors.onSurfaceDisabled,
    },
  })

  const barrierFreeChip =
    poi.barrierFree === true ? (
      <Chip avatar={<StyledIcon source='wheelchair-accessibility' />} style={styles.chip} mode='outlined'>
        <Text variant='body2'>{t('common:accessible')}</Text>
      </Chip>
    ) : (
      <Chip avatar={<StyledIcon Icon={NotAccessibleIcon} />} style={styles.chip} mode='outlined'>
        <Text variant='body2'>{t('common:notAccessible')}</Text>
      </Chip>
    )

  return (
    <ChipsContainer>
      <Chip avatar={<ChipCategoryIcon source={poi.category.icon} />} mode='outlined' style={styles.chip}>
        <Text variant='body2'>{poi.category.name}</Text>
      </Chip>
      {poi.organization !== null && (
        <Chip mode='outlined' style={styles.chip}>
          <Text variant='body2'>{poi.organization.name}</Text>
        </Chip>
      )}
      {poi.barrierFree !== null && barrierFreeChip}
    </ChipsContainer>
  )
}

export default PoiChips
