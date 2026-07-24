import React, { ReactElement } from 'react'
import { SegmentedButtons } from 'react-native-paper'
import { useTheme } from 'styled-components/native'

type ToggleTextButtonGroupProps<T extends string> = {
  setValue: (value: T) => void
  options: T[]
  value: T
  getLabel: (value: T) => string
}

const ToggleTextButtonGroup = <T extends string>({
  setValue,
  options,
  value,
  getLabel,
}: ToggleTextButtonGroupProps<T>): ReactElement => {
  const theme = useTheme()

  const buttons = options.map(option => ({
    icon: value === option ? 'check' : undefined,
    value: option,
    label: getLabel(option),
    checkedColor: theme.colors.onPrimary,
    uncheckedColor: theme.colors.onSurface,
    style: {
      backgroundColor: value === option ? theme.colors.primary : theme.colors.background,
      borderColor: theme.colors.primary,
    },
  }))

  return <SegmentedButtons value={value} onValueChange={setValue} buttons={buttons} density='small' />
}

export default ToggleTextButtonGroup
