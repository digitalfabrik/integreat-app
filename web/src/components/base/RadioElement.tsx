import React, { ReactElement, ReactNode } from 'react'
import styled from 'styled-components'

export const RadioGroupContainer = styled.fieldset`
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
  margin-right: 20px;
  flex-shrink: 0;
`

const RadioLabel = styled.label`
  display: flex;
`

const RadioElementContainer = styled.div`
  width: 100%;
  padding: 12px 0;
`

type Option<T> = {
  groupId: string
  id: T
  label: string
  checked: boolean
  onChange: (newValue: T) => void
  children?: ReactNode
}

type RadioGroupProps = {
  caption: string
  children?: ReactNode | ReactNode[]
}

export const RadioGroup = ({ caption, children }: RadioGroupProps): ReactElement => (
  <RadioGroupContainer>
    <RadioGroupCaption>{caption}</RadioGroupCaption>
    {children}
  </RadioGroupContainer>
)

const RadioElement = <T extends string>({
  groupId,
  id,
  label,
  checked,
  children,
  onChange,
}: Option<T>): ReactElement => (
  <RadioElementContainer>
    <RadioLabel htmlFor={label}>
      <Radio
        name={groupId}
        id={label}
        type='radio'
        checked={checked}
        value={id}
        onChange={event => onChange(event.target.value as T)}
      />
      {label}
    </RadioLabel>
    {checked && children}
  </RadioElementContainer>
)

export default RadioElement
