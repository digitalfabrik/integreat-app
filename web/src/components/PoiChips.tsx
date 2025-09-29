import AccessibleIcon from '@mui/icons-material/Accessible'
import NotAccessibleIcon from '@mui/icons-material/NotAccessible'
import Typography, { TypographyProps } from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { PoiModel } from 'shared/api'

import Icon from './base/Icon'

const ChipsContainer = styled('div')`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
  margin-bottom: 8px;
  align-items: center;
  justify-content: flex-start;
`

const Chip = styled(Typography)<TypographyProps>`
  color: ${props => props.theme.palette.text.secondary};
  display: flex;
  padding-inline: 12px;
  align-items: center;
  gap: 6px;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.palette.text.secondary};
  height: 24px;
  ${props => props.theme.breakpoints.down('md')} {
    margin-bottom: 6px;
  }
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
      <Chip variant='label2' component='div'>
        <ChipIcon src={category.icon} />
        {category.name}
      </Chip>
      {poi.organization !== null && (
        <Chip variant='label2' component='div'>
          {poi.organization.name}
        </Chip>
      )}
      {poi.barrierFree !== null && (
        <Chip variant='label2' component='div'>
          {barrierFreeChip}
        </Chip>
      )}
    </ChipsContainer>
  )
}

export default PoiChips
