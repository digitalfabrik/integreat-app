import Chip, { chipClasses } from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { getNewsColor, getNewsSourceLabel, NewsSource } from 'shared/api'

const SourceChip = styled(Chip)<{ source: NewsSource }>(({ source, theme }) => ({
  [`&.${chipClasses.outlined}`]: {
    borderColor: getNewsColor({ palette: theme.palette, source }),
    backgroundColor: theme.palette.background.default,
  },
}))

type NewsSourceChipProps = {
  source: NewsSource
}

const NewsSourceChip = ({ source }: NewsSourceChipProps): ReactElement => {
  const { t } = useTranslation(['news'])
  const label = getNewsSourceLabel({ source, localNewsLabel: t($ => $.local) })
  return <SourceChip label={label} source={source} variant='outlined' size='small' />
}

export default NewsSourceChip
