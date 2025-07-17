import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import { PoiModel } from 'shared/api'

import { AccessibleIcon, NotAccessibleIcon } from '../assets'
import SimpleImage from './SimpleImage'

const ChipsContainer = styled.View`
  flex-flow: row wrap;
  gap: 8px;
`

const Chip = styled.View`
  height: 24px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.38);
  flex-direction: row;
  align-items: center;
  gap: 6px;
  padding-inline: 12px;
`

const ChipIcon = styled(SimpleImage)`
  width: 12px;
  height: 12px;
`

const PoiChips = ({ poi }: { poi: PoiModel }): ReactElement => {
  const { t } = useTranslation()

  const barrierFreeChip =
    poi.barrierFree === true ? (
      <>
        <ChipIcon source={AccessibleIcon} />
        <Text>{t('common:accessible')}</Text>
      </>
    ) : (
      <>
        <ChipIcon source={NotAccessibleIcon} />
        <Text>{t('common:notAccessible')}</Text>
      </>
    )

  return (
    <ChipsContainer>
      {poi.barrierFree !== null && <Chip>{barrierFreeChip}</Chip>}
      {poi.organization !== null && (
        <Chip>
          <Text>{poi.organization.name}</Text>
        </Chip>
      )}
      <Chip>
        <ChipIcon source={poi.category.icon} />
        <Text>{poi.category.name}</Text>
      </Chip>
    </ChipsContainer>
  )
}

export default PoiChips
