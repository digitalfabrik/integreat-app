import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import Radio from '@mui/material/Radio'
import MuiRadioGroup from '@mui/material/RadioGroup'
import TextField from '@mui/material/TextField'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

const StyledFormControl = styled(FormControl)`
  margin-top: 20px;
`
export type InputProps = {
  id: string
  value: string
  onChange: (input: string) => void
  required?: boolean
  label?: string
}

type RadioGroupProps<T extends string> = {
  caption: string
  groupId: string
  selectedValue: T
  submitted?: boolean
  onChange: (value: T) => void
  values: RadioButtonValue<T>[]
  required?: boolean
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
  required = false,
}: RadioGroupProps<T>): ReactElement => {
  const selectedOptionInput = values.find(v => v.key === selectedValue)?.inputProps
  const hasInputError = submitted && selectedOptionInput?.required && !selectedOptionInput.value

  return (
    <StyledFormControl required={required} error={hasInputError}>
      <FormLabel id={groupId}>{caption}</FormLabel>
      <MuiRadioGroup
        aria-labelledby={groupId}
        value={selectedValue}
        name={groupId}
        onChange={event => onChange(event.target.value as T)}>
        {values.map(({ key, label, inputProps }) => (
          <React.Fragment key={key}>
            <FormControlLabel control={<Radio />} value={key} label={label} />
            {selectedValue === key && inputProps && (
              <TextField
                id={`${key}-input`}
                label={inputProps.label ?? label}
                required={inputProps.required ?? true}
                value={inputProps.value}
                onChange={event => inputProps.onChange(event.target.value)}
                error={submitted && inputProps.required && !inputProps.value}
                size='small'
                variant='outlined'
              />
            )}
          </React.Fragment>
        ))}
      </MuiRadioGroup>
    </StyledFormControl>
  )
}

export default RadioGroup
