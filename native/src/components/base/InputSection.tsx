import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { KeyboardTypeOptions } from 'react-native'
import { css } from 'styled-components'
import styled from 'styled-components/native'

import Text from './Text'

const DEFAULT_MULTI_LINE_NUMBER = 3
const LINE_HEIGHT = 24

const Container = styled.View`
  gap: 4px;
`

const TitleContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const ThemedText = styled.Text`
  display: flex;
  text-align: center;
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
`

const Title = styled(ThemedText)`
  font-weight: bold;
  text-align: left;
`

const Input = styled.TextInput<{ numberOfLines: number; invalid: boolean }>`
  border-width: 1px;
  border-color: ${props => (props.invalid ? props.theme.colors.invalidInput : props.theme.colors.themeColor)};
  color: ${props => props.theme.colors.textColor};
  padding: 8px;
  ${props =>
    props.numberOfLines > 1 &&
    css`
      height: ${props.numberOfLines * LINE_HEIGHT}px;
      text-align-vertical: top;
    `};
`

type InputSectionProps = {
  title?: string
  hint?: string
  description?: string
  value: string
  onChange: (input: string) => void
  onBlur?: () => void
  keyboardType?: KeyboardTypeOptions
  multiline?: boolean
  numberOfLines?: number
  showOptional?: boolean
  invalid?: boolean
}

const InputSection = ({
  title,
  description,
  value,
  onChange,
  onBlur,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = DEFAULT_MULTI_LINE_NUMBER,
  showOptional = false,
  invalid = false,
  hint,
}: InputSectionProps): ReactElement => {
  const { t } = useTranslation('common')
  return (
    <Container>
      {title || showOptional || hint ? (
        <TitleContainer>
          {title ? <Title>{title}</Title> : null}
          {hint ? <Text>{hint}</Text> : null}
          {showOptional && <Text>({t('optional')})</Text>}
        </TitleContainer>
      ) : null}
      {description ? <Text>{description}</Text> : null}
      <Input
        onChangeText={onChange}
        onBlur={onBlur}
        value={value}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : 1}
        keyboardType={keyboardType}
        invalid={invalid}
        returnKeyType='done'
        blurOnSubmit
      />
    </Container>
  )
}

export default InputSection
