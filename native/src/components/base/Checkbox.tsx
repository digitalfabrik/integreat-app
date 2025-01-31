import CheckBox from '@react-native-community/checkbox'
import React, { ReactElement } from 'react'
import styled, { useTheme } from 'styled-components/native'

const StyledCheckbox = styled(CheckBox)`
  width: 16px;
  height: 16px;
`

const Container = styled.View`
  display: flex;
  flex: 1;
`

type CheckboxProps = {
  checked: boolean
  setChecked: (checked: boolean) => void
}

const Checkbox = ({ checked, setChecked }: CheckboxProps): ReactElement => {
  const { themeColor } = useTheme().colors
  return (
    <Container>
      <StyledCheckbox
        disabled={false}
        value={checked}
        onValueChange={setChecked}
        tintColors={{ true: themeColor }}
        onCheckColor={themeColor}
        onTintColor={themeColor}
      />
    </Container>
  )
}

export default Checkbox
