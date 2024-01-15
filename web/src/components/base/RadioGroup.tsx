import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { UiDirectionType } from 'translations'

import Input, { InputProps } from './Input'

const RadioGroupContainer = styled.fieldset`
  border: none;
  box-sizing: border-box;
  margin: 20px 0;
  padding: 0;
  width: 100%;
`

const RadioGroupCaption = styled.legend`
  font-weight: bold;
  padding-bottom: 10px;
`

const Radio = styled.input`
  width: 1.3em;
  height: 1.3em;
  align-self: center;
  accent-color: ${props => props.theme.colors.textSecondaryColor};
  flex-shrink: 0;
`

const RadioLabel = styled.label`
  display: flex;
  gap: 20px;
`

const RadioElementContainer = styled.div`
  width: 100%;
  padding: 12px 0;
`

type RadioGroupProps<T extends string> = {
  caption: string
  groupId: string
  direction: UiDirectionType
  selectedValue: T
  submitted?: boolean
  onChange: (value: T) => void
  values: RadioButtonValue<T>[]
}

type RadioButtonValue<T extends string> = {
  key: T
  label: string
  inputProps?: Omit<InputProps, 'direction' | 'id'>
}

export const RadioGroup = <T extends string>({
  caption,
  groupId,
  selectedValue,
  values,
  submitted,
  direction,
  onChange,
}: RadioGroupProps<T>): ReactElement => (
  <RadioGroupContainer role='radiogroup'>
    <RadioGroupCaption>{caption}</RadioGroupCaption>
    {values.map(({ label, key, inputProps }) => (
      <RadioElementContainer key={key}>
        <RadioLabel htmlFor={key}>
          <Radio
            id={key}
            name={groupId}
            type='radio'
            value={key}
            checked={selectedValue === key}
            onChange={event => onChange(event.target.value as T)}
          />
          {label}
        </RadioLabel>
        {selectedValue === key && inputProps && (
          <Input
            id={`${key}-input`}
            hint={inputProps.hint ?? label}
            hintIsLabel={inputProps.hintIsLabel ?? true}
            required={inputProps.required ?? true}
            direction={direction}
            value={inputProps.value}
            onChange={inputProps.onChange}
            submitted={submitted}
          />
        )}
      </RadioElementContainer>
    ))}
  </RadioGroupContainer>
)

export default RadioGroup
