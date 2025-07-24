import MuiCheckbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import React, { ReactElement } from 'react'

type CheckboxProps = {
  checked: boolean
  setChecked: (checked: boolean) => void
  label: string | ReactElement
}

const Checkbox = ({ checked, setChecked, label }: CheckboxProps): ReactElement => (
  <FormControlLabel control={<MuiCheckbox checked={checked} onChange={() => setChecked(!checked)} />} label={label} />
)

export default Checkbox
