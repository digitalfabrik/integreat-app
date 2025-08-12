import styled from '@emotion/styled'
import AccessibleIcon from '@mui/icons-material/Accessible'
import NotAccessibleIcon from '@mui/icons-material/NotAccessible'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { PoiModel } from 'shared/api'

import Icon from './base/Icon'

const ChipsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
  margin-bottom: 8px;
  align-items: center;
  justify-content: flex-start;
`

const Chip = styled.div`
  color: ${props => props.theme.legacy.colors.textSecondaryColor};
  display: flex;
  padding-inline: 12px;
  align-items: center;
  gap: 6px;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.legacy.colors.textSecondaryColor};
  height: 24px;
  font-size: 12px;
`

const ChipIcon = styled(Icon)`
  width: 16px;
  height: 16px;
`

const PoiChips = ({ poi }: { poi: PoiModel }): ReactElement => {
  const { t } = useTranslation()
  const { category } = poi

  const barrierFreeChip =
    poi.barrierFree === true ? (
      <>
        <ChipIcon src={AccessibleIcon} />
        {t('common:accessible')}
      </>
    ) : (
      <>
        <ChipIcon src={NotAccessibleIcon} />
        {t('common:notAccessible')}
      </>
    )

  return (
    <ChipsContainer>
      <Chip>
        <ChipIcon src={category.icon} />
        {category.name}
      </Chip>
      {poi.organization !== null && <Chip>{poi.organization.name}</Chip>}
      {poi.barrierFree !== null && <Chip>{barrierFreeChip}</Chip>}
    </ChipsContainer>
  )
}

export default PoiChips
