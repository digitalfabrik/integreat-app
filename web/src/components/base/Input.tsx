import { css, SerializedStyles, Theme } from '@emotion/react'
import styled from '@emotion/styled'
import React, { ChangeEvent, ReactElement } from 'react'

const DEFAULT_MULTI_LINE_NUMBER = 7

const GeneralInputStyles = ({ theme, submitted }: { theme: Theme; submitted: boolean }): SerializedStyles => css`
  padding: 0.75rem;
  background-clip: padding-box;
  border: 1px solid ${theme.colors.textSecondaryColor};
  ${submitted &&
  css`
    :invalid {
      :focus {
        outline-color: ${theme.colors.invalidInput}33;
      }

      border-width: 2px;
      border-color: ${theme.colors.invalidInput};
    }
  `}
`

const StyledTextArea = styled.textarea<{ submitted: boolean; small: boolean }>`
  ${GeneralInputStyles};
  border-radius: 0.2rem 0.2rem 0;
  min-height: ${props => (props.small ? '16px' : '60px')};
  resize: none;
`

const TextInput = styled.input<{ submitted: boolean }>`
  ${GeneralInputStyles};
  border-radius: 0.2rem;
  background-clip: padding-box;
  resize: none;
`

const CompactTitle = styled.label`
  position: relative;
  padding: 0 4px;
  top: 0.5rem;
  inset-inline-start: 10px;
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
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => void
  multiline?: boolean
  numberOfLines?: number
  maxLength?: number
  required?: boolean
  hint?: string
  hintIsLabel?: boolean
  placeholder?: string
}

const Input = ({
  id,
  onChange,
  onKeyDown,
  numberOfLines = DEFAULT_MULTI_LINE_NUMBER,
  value,
  submitted = false,
  multiline,
  maxLength,
  placeholder,
  required,
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
      <CompactTitle as={hintIsLabel ? 'label' : 'span'} htmlFor={hintIsLabel ? id : undefined}>
        {hint}
      </CompactTitle>
      {multiline ? (
        <StyledTextArea
          id={id}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
          value={value}
          rows={numberOfLines}
          maxLength={maxLength}
          required={required}
          submitted={submitted}
          placeholder={placeholder}
          small={numberOfLines === 1}
        />
      ) : (
        <TextInput
          id={id}
          type='text'
          onChange={onInputChange}
          onKeyDown={onKeyDown}
          required={required}
          value={value}
          maxLength={maxLength}
          submitted={submitted}
          placeholder={placeholder}
        />
      )}
    </InputContainer>
  )
}

export default Input
