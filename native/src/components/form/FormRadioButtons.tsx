import React, { ReactElement } from 'react'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { View } from 'react-native'
import { RadioButton } from 'react-native-paper'

import FormInput from './FormInput'

type RadioButtonType<T extends FieldValues> = {
  key: string
  label: string
  inputName?: Path<T>
}

type FormRadioButtonsProps<T extends FieldValues> = {
  name: Path<T>
  control: Control<T, unknown>
  values: RadioButtonType<T>[]
}

const FormRadioButtons = <T extends FieldValues>({ name, control, values }: FormRadioButtonsProps<T>): ReactElement => (
  <Controller
    name={name}
    control={control}
    render={({ field: { onChange, value } }) => (
      <RadioButton.Group onValueChange={onChange} value={value}>
        {values.map(({ key, label, inputName }) => (
          <View key={key}>
            <RadioButton.Item mode='android' labelVariant='bodySmall' label={label} value={key} />
            {inputName !== undefined && value === key && (
              <FormInput rules={{ required: true }} name={inputName} control={control} title={inputName} />
            )}
          </View>
        ))}
      </RadioButton.Group>
    )}
  />
)

export default FormRadioButtons
