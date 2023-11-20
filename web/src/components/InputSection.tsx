import React, { HTMLInputTypeAttribute, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import TextInput from './TextInput'

const MULTI_LINE_NUMBER = 7

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

const StyledTextArea = styled.textarea`
  resize: none;
  min-height: 60px;
`

type InputSectionProps = {
  id: string
  title: string
  description?: string
  value: string
  onChange: (input: string) => void
  type?: HTMLInputTypeAttribute
  multiline?: boolean
  showOptional?: boolean
}

const InputSection = ({
  id,
  title,
  description,
  value,
  onChange,
  type,
  multiline = false,
  showOptional = false,
}: InputSectionProps): ReactElement => {
  const { t } = useTranslation('common')
  return (
    <Container>
      <TitleContainer>
        <Title htmlFor={id}>{title}</Title>
        {showOptional && <div>({t('optional')})</div>}
      </TitleContainer>
      {description ? <div>{description}</div> : null}
      {multiline ? (
        <StyledTextArea
          id={id}
          onChange={event => onChange(event.target.value)}
          value={value}
          rows={MULTI_LINE_NUMBER}
        />
      ) : (
        <TextInput id={id} type={type} onChange={event => onChange(event.target.value)} value={value} />
      )}
    </Container>
  )
}

export default InputSection
