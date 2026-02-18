import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { AccessibilityRole, KeyboardTypeOptions } from 'react-native'
import { HelperText, Text, TextInput } from 'react-native-paper'
import styled from 'styled-components/native'

import { isRTLText } from '../../constants/contentDirection'

const DEFAULT_MULTI_LINE_NUMBER = 3
const LINE_HEIGHT = 24

const Container = styled.View`
  gap: 4px;
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
  maxLength?: number
  showOptional?: boolean
  invalid?: boolean
  accessibilityRole?: AccessibilityRole
}

const InputSection = ({
  title,
  description,
  value,
  onChange,
  onBlur,
  keyboardType = 'default',
  multiline = false,
  maxLength,
  numberOfLines = DEFAULT_MULTI_LINE_NUMBER,
  showOptional = false,
  invalid = false,
  hint,
  accessibilityRole,
}: InputSectionProps): ReactElement => {
  const { t } = useTranslation('common')
  const lines = multiline ? numberOfLines : 1
  return (
    <Container accessible>
      {showOptional && <Text style={{ textAlign: 'right' }}>({t('common:optional')})</Text>}
      <TextInput
        mode='outlined'
        label={title}
        onChangeText={onChange}
        onBlur={onBlur}
        value={value}
        multiline={multiline}
        maxLength={maxLength}
        numberOfLines={lines}
        style={[
          multiline ? { minHeight: lines * LINE_HEIGHT } : {},
          { textAlign: isRTLText(title ?? '') ? 'right' : 'left' },
        ]}
        contentStyle={multiline ? { textAlignVertical: 'top' } : {}}
        keyboardType={keyboardType}
        error={invalid}
        returnKeyType='done'
        accessibilityRole={accessibilityRole ?? 'search'}
        accessibilityLabel={title}
        accessibilityLabelledBy={description}
        testID={title ?? value}
      />
      {!!hint && (
        <HelperText style={{ textAlign: isRTLText(hint) ? 'right' : 'left' }} type='info'>
          {hint}
        </HelperText>
      )}
      {!!description && (
        <HelperText style={{ textAlign: isRTLText(description) ? 'right' : 'left' }} type='info' nativeID={description}>
          {description}
        </HelperText>
      )}
    </Container>
  )
}

export default InputSection
