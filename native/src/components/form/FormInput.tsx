import React, { ReactElement } from 'react'
import { Control, Controller, FieldValues, Path, RegisterOptions } from 'react-hook-form'

import InputSection from '../base/InputSection'

type FormInputProps<T extends FieldValues> = {
  name: Path<T>
  control: Control<T, unknown>
  rules?: RegisterOptions<T, Path<T>>
  title?: string
  hint?: string
  showOptional?: boolean
  multiline?: boolean
}

const FormInput = <T extends FieldValues>({
  name,
  control,
  rules,
  title,
  hint,
  showOptional = false,
  multiline = false,
}: FormInputProps<T>): ReactElement => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    render={({ field: { onChange, onBlur, value }, fieldState: { invalid } }) => (
      <InputSection
        title={title}
        hint={hint}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        invalid={invalid}
        multiline={multiline}
        showOptional={showOptional}
      />
    )}
  />
)

export default FormInput
