import React, { ChangeEvent, ReactElement } from 'react'
import styled, { css } from 'styled-components'

import { UiDirectionType } from 'translations'

const DEFAULT_MULTI_LINE_NUMBER = 7

const GeneralInputStyles = css<{ submitted: boolean }>`
  padding: 0.75rem;
  background-clip: padding-box;
  border: 1px solid ${props => props.theme.colors.textSecondaryColor};
  ${props =>
    props.submitted &&
    css`
      :invalid {
        :focus {
          outline-color: ${props => props.theme.colors.invalidInput}33;
        }

        border-width: 2px;
        border-color: ${props => props.theme.colors.invalidInput};
      }
    `}
`

const StyledTextArea = styled.textarea`
  ${GeneralInputStyles};
  border-radius: 0.2rem 0.2rem 0;
  resize: vertical;
  min-height: 60px;
`

const TextInput = styled.input`
  ${GeneralInputStyles};
  border-radius: 0.2rem;
  background-clip: padding-box;
  resize: none;
`

const CompactTitle = styled.label<{ direction: 'ltr' | 'rtl' }>`
  position: relative;
  padding: 0 4px;
  top: 0.5rem;
  ${props => (props.direction === 'rtl' ? 'right: 10px' : 'left: 10px')};
  font-size: ${props => props.theme.fonts.decorativeFontSizeSmall};
  background-color: ${props => props.theme.colors.backgroundColor};
  width: fit-content;
`

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
`

export type InputProps = {
  id: string
  value: string
  submitted?: boolean
  onChange: (input: string) => void
  direction: UiDirectionType
  multiline?: boolean
  numberOfLines?: number
  maxLength?: number
  required?: boolean
  hint?: string
  hintIsLabel?: boolean
}

const Input = ({
  id,
  onChange,
  numberOfLines = DEFAULT_MULTI_LINE_NUMBER,
  value,
  submitted = false,
  multiline,
  maxLength,
  required,
  direction,
  hint,
  hintIsLabel = false,
}: InputProps): ReactElement => {
  const onInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const element = event.target
    if (element.validity.customError) {
      element.setCustomValidity('')
      element.checkValidity() // unset error
    }
    onChange(element.value)
  }
  return (
    <InputContainer>
      <CompactTitle direction={direction} as={hintIsLabel ? 'label' : 'span'} htmlFor={hintIsLabel ? id : undefined}>
        {hint}
      </CompactTitle>
      {multiline ? (
        <StyledTextArea
          id={id}
          onChange={onInputChange}
          value={value}
          rows={numberOfLines}
          maxLength={maxLength}
          required={required}
          submitted={submitted}
        />
      ) : (
        <TextInput
          id={id}
          type='text'
          onChange={onInputChange}
          required={required}
          value={value}
          maxLength={maxLength}
          submitted={submitted}
        />
      )}
    </InputContainer>
  )
}

export default Input
