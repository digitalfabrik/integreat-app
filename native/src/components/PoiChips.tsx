import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
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

const Chip = styled.View`
  border-radius: 32px;
  border: 1px solid ${props => props.theme.legacy.colors.textSecondaryColor};
  flex-direction: row;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
`

const ChipCategoryIcon = styled(SimpleImage)`
  color: ${props => props.theme.legacy.colors.textColor};
  width: 24px;
  height: 24px;
`

const PoiChips = ({ poi }: { poi: PoiModel }): ReactElement => {
  const { t } = useTranslation()

  const barrierFreeChip =
    poi.barrierFree === true ? (
      <>
        <Icon source='wheelchair-accessibility' />
        <Text>{t('common:accessible')}</Text>
      </>
    ) : (
      <>
        <Icon Icon={NotAccessibleIcon} />
        <Text>{t('common:notAccessible')}</Text>
      </>
    )

  return (
    <ChipsContainer>
      <Chip>
        <ChipCategoryIcon source={poi.category.icon} />
        <Text>{poi.category.name}</Text>
      </Chip>
      {poi.organization !== null && (
        <Chip>
          <Text>{poi.organization.name}</Text>
        </Chip>
      )}
      {poi.barrierFree !== null && <Chip>{barrierFreeChip}</Chip>}
    </ChipsContainer>
  )
}

export default PoiChips
