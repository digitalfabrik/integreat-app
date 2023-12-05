import React, { HTMLInputTypeAttribute, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

const DEFAULT_MULTI_LINE_NUMBER = 7

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const Title = styled.label`
  font-weight: bold;
`

const GeneralInputStyles = css`
  border-radius: 0.2rem 0.2rem 0;
  padding: 0.75rem 0.75rem;
  background-clip: padding-box;
  border: 1px solid ${props => props.theme.colors.textDisabledColor};
`

const TextInput = styled.input`
  ${GeneralInputStyles};
  resize: none;
`

const StyledTextArea = styled.textarea`
  ${GeneralInputStyles};
  resize: vertical;
  min-height: 60px;
`

export const CompactTitle = styled.label`
  position: relative;
  padding: 0 4px;
  top: 0.45rem;
  left: 10px;
  font-size: ${props => props.theme.fonts.decorativeFontSizeSmall};
  background-color: ${props => props.theme.colors.backgroundColor};
  width: fit-content;
`

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
`

type InputSectionProps = {
  id: string
  title: string
  description?: string
  value: string
  onChange: (input: string) => void
  type?: HTMLInputTypeAttribute
  multiline?: boolean
  numberOfLines?: number
  showOptional?: boolean
}

const MaterialInputSection = ({
  id,
  title,
  description,
  value,
  onChange,
  type,
  multiline = false,
  numberOfLines = DEFAULT_MULTI_LINE_NUMBER,
  showOptional = false,
}: InputSectionProps): ReactElement => {
  const { t } = useTranslation('common')
  return (
    <Container>
      {description ? <div>{description}</div> : null}
      <InputContainer>
        <CompactTitle htmlFor={id}>
          {title}
          {showOptional && ` (${t('optional')})`}
        </CompactTitle>
        {multiline ? (
          <StyledTextArea id={id} onChange={event => onChange(event.target.value)} value={value} rows={numberOfLines} />
        ) : (
          <TextInput id={id} type={type} onChange={event => onChange(event.target.value)} value={value} />
        )}
      </InputContainer>
    </Container>
  )
}

export default MaterialInputSection
