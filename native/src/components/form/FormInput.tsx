import React, { ReactElement } from 'react'
import { Control, Controller, FieldValues, Path, RegisterOptions } from 'react-hook-form'
import { EnterKeyHintTypeOptions } from 'react-native'

import InputSection from '../base/InputSection'

type FormInputProps<T extends FieldValues> = {
  name: Path<T>
  control: Control<T, unknown>
  rules?: RegisterOptions<T, Path<T>>
  title?: string
  hint?: string
  maxLength?: number
  showOptional?: boolean
  multiline?: boolean
  enterKeyHint?: EnterKeyHintTypeOptions
}

const FormInput = <T extends FieldValues>({
  name,
  control,
  rules,
  title,
  hint,
  maxLength,
  showOptional = false,
  multiline = false,
  enterKeyHint,
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
        maxLength={maxLength}
        multiline={multiline}
        showOptional={showOptional}
        enterKeyHint={enterKeyHint}
      />
    )}
  />
)

export default FormInput
