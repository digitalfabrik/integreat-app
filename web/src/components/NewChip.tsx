import Chip from '@mui/material/Chip'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

type NewChipProps = {
  className?: string
}

const NewChip = ({ className }: NewChipProps): ReactElement => {
  const { t } = useTranslation('common')
  return <Chip label={t('new')} color='primary' className={className} size='small' />
}

export default NewChip
