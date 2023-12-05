import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

const DEFAULT_MULTI_LINE_NUMBER = 7

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const Title = styled.label`
  font-weight: bold;
`

const GeneralInputStyles = css<{ submitted: boolean }>`
  padding: 0.75rem 0.75rem;
  background-clip: padding-box;
  border: 1px solid ${props => props.theme.colors.textDisabledColor};
  ${props =>
    props.submitted &&
    css`
      :invalid {
        :focus {
          outline-color: ${props => props.theme.colors.invalidInput};
        }
        border-width: 2px;
        border-color: ${props => props.theme.colors.invalidInput};
      }
    `}
`

export const CompactTitle = styled.label`
  position: relative;
  padding: 0 4px;
  top: 0.9rem;
  left: 10px;
  font-size: ${props => props.theme.fonts.decorativeFontSizeSmall};
  background-color: ${props => props.theme.colors.backgroundColor};
  width: fit-content;
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

type InputProps = {
  id: string
  value: string
  submitted?: boolean
  onChange: (input: string) => void
  multiline?: boolean
  numberOfLines?: number
  maxLength?: number
  required?: boolean
}

type InputSectionProps = (
  | {
      title: string
      compact?: false
      subtitle?: string
      description?: string
    }
  | { title: string; compact: true }
) &
  ({ optional: true; showOptional?: boolean } | { optional?: false; showOptional?: false }) &
  Omit<InputProps, 'required'>

const Input = ({
  id,
  onChange,
  numberOfLines = DEFAULT_MULTI_LINE_NUMBER,
  value,
  submitted = false,
  multiline,
  maxLength,
  required,
}: InputProps): ReactElement => {
  if (multiline) {
    return (
      <StyledTextArea
        id={id}
        onChange={event => onChange(event.target.value)}
        value={value}
        rows={numberOfLines}
        maxLength={maxLength}
        required={required}
        submitted={submitted}
      />
    )
  }
  return (
    <TextInput
      id={id}
      type='text'
      onChange={event => onChange(event.target.value)}
      required={required}
      value={value}
      maxLength={maxLength}
      submitted={submitted}
    />
  )
}

export const CompactInputSection = ({
  id,
  title,
  optional,
  showOptional,
  ...props
}: Extract<InputSectionProps, { compact: true }>): ReactElement => {
  const { t } = useTranslation('common')
  return (
    <Container>
      <CompactTitle htmlFor={id}>
        {title}
        {showOptional && ` (${t('optional')})`}
      </CompactTitle>
      <Input id={id} {...props} required={!optional} />
    </Container>
  )
}

const InputSection = (props: InputSectionProps): ReactElement => {
  const { t } = useTranslation('common')
  const { compact } = props

  if (compact) {
    return <CompactInputSection {...props} />
  }
  const { id, title, subtitle, description, optional = false, showOptional } = props
  return (
    <Container>
      <TitleContainer>
        <Title htmlFor={id}>{title}</Title>
        {showOptional && <div>({t('optional')})</div>}
      </TitleContainer>
      {description ? <div>{description}</div> : null}
      {!!subtitle && <CompactTitle as='span'>{subtitle}</CompactTitle>}
      <Input {...props} required={!optional} />
    </Container>
  )
}

export default InputSection
