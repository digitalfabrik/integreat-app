import styled from '@emotion/styled'
import { Checkbox as MUICheckbox, FormControlLabel } from '@mui/material'
import React, { ReactElement } from 'react'

const StyledLabel = styled(FormControlLabel)`
  font-weight: 400;
`

type CheckboxProps = {
  checked: boolean
  setChecked: (checked: boolean) => void
  label: string | ReactElement
}

const Checkbox = ({ checked, setChecked, label }: CheckboxProps): ReactElement => (
  <StyledLabel control={<MUICheckbox checked={checked} onChange={() => setChecked(!checked)} />} label={label} />
)

export default Checkbox
