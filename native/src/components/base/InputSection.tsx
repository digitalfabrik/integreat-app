import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { KeyboardTypeOptions } from 'react-native'
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

const Input = styled.TextInput<{ numberOfLines: number }>`
  border-width: 1px;
  border-color: ${props => props.theme.colors.themeColor};
  text-align-vertical: top;
  color: ${props => props.theme.colors.textColor};
  padding: 8px;
  ${props => props.numberOfLines !== 1 && `height: ${props.numberOfLines * LINE_HEIGHT}px`};
`

type InputSectionProps = {
  title: string
  description?: string
  value: string
  onChange: (input: string) => void
  keyboardType?: KeyboardTypeOptions
  multiline?: boolean
  numberOfLines?: number
  showOptional?: boolean
}

const InputSection = ({
  title,
  description,
  value,
  onChange,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = DEFAULT_MULTI_LINE_NUMBER,
  showOptional = false,
}: InputSectionProps): ReactElement => {
  const { t } = useTranslation('common')
  return (
    <Container>
      <TitleContainer>
        <Title>{title}</Title>
        {showOptional && <Text>({t('optional')})</Text>}
      </TitleContainer>
      {description ? <Text>{description}</Text> : null}
      <Input
        onChangeText={onChange}
        value={value}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : 1}
        keyboardType={keyboardType}
        returnKeyType='done'
        blurOnSubmit
      />
    </Container>
  )
}

export default InputSection
