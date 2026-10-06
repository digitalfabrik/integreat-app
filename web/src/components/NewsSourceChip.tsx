import Chip, { chipClasses } from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { getNewsColor, getNewsSourceLabel, NewsSource } from 'shared/api'

const SourceChip = styled(Chip)<{ source: NewsSource }>(({ source, theme }) => {
  const [color, contrastColor] = getNewsColor({ palette: theme.palette, source })
  return {
    [`&.${chipClasses.outlined}`]: {
      color: contrastColor,
      borderColor: color,
      backgroundColor: color,
    },
  }
})

type NewsSourceChipProps = {
  source: NewsSource
}

const NewsSourceChip = ({ source }: NewsSourceChipProps): ReactElement => {
  const { t } = useTranslation()
  const label = getNewsSourceLabel({ source, t })
  return <SourceChip label={label} source={source} variant='outlined' size='small' />
}

export default NewsSourceChip
