import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup as MUIRadioGroup } from '@mui/material'
import React, { ReactElement } from 'react'

import Input, { InputProps } from './Input'

type RadioGroupProps<T extends string> = {
  caption: string
  groupId: string
  selectedValue: T
  submitted?: boolean
  onChange: (value: T) => void
  values: RadioButtonValue<T>[]
}

type RadioButtonValue<T extends string> = {
  key: T
  label: string
  inputProps?: Omit<InputProps, 'id'>
}

export const RadioGroup = <T extends string>({
  caption,
  groupId,
  selectedValue,
  values,
  submitted,
  onChange,
}: RadioGroupProps<T>): ReactElement => (
  <FormControl>
    <FormLabel id={groupId}>{caption}</FormLabel>
    <MUIRadioGroup
      aria-labelledby={groupId}
      defaultValue={selectedValue}
      name={groupId}
      onChange={event => onChange(event.target.value as T)}>
      {values.map(({ key, label, inputProps }) => (
        <>
          <FormControlLabel control={<Radio />} value={key} label={label} />
          {selectedValue === key && inputProps && (
            <Input
              id={`${key}-input`}
              hint={inputProps.hint ?? label}
              hintIsLabel={inputProps.hintIsLabel ?? true}
              required={inputProps.required ?? true}
              value={inputProps.value}
              onChange={inputProps.onChange}
              submitted={submitted}
            />
          )}
        </>
      ))}
    </MUIRadioGroup>
  </FormControl>
)

export default RadioGroup
