import CheckBox from '@react-native-community/checkbox'
import React, { ReactElement } from 'react'
import styled, { useTheme } from 'styled-components/native'

const StyledCheckbox = styled(CheckBox)`
  width: 32px;
  height: 32px;
`

type CheckboxProps = {
  checked: boolean
  setChecked: (checked: boolean) => void
}

const Checkbox = ({ checked, setChecked }: CheckboxProps): ReactElement => {
  const { themeColor } = useTheme().legacy.colors
  return (
    <StyledCheckbox
      value={checked}
      onValueChange={setChecked}
      tintColors={{ true: themeColor }}
      onCheckColor={themeColor}
      onTintColor={themeColor}
    />
  )
}

export default Checkbox
