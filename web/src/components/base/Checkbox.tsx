import { Checkbox as MuiCheckbox, FormControlLabel, Typography } from '@mui/material'
import React, { ReactElement } from 'react'

type CheckboxProps = {
  checked: boolean
  setChecked: (checked: boolean) => void
  label: string | ReactElement
}

const Checkbox = ({ checked, setChecked, label }: CheckboxProps): ReactElement => (
  <FormControlLabel
    control={<MuiCheckbox checked={checked} onChange={() => setChecked(!checked)} />}
    label={<Typography variant='label1'>{label}</Typography>}
  />
)

export default Checkbox
