import React, { ReactElement } from 'react'
import { customText } from 'react-native-paper'
import styled from 'styled-components/native'

import { TypographyVariant } from 'build-configs/TypographyType'

const PaperText = customText<TypographyVariant>()

const StyledText = styled(PaperText)`
  color: ${props => props.theme.colors.onSurface};
`

type TextProps = React.ComponentProps<typeof PaperText>

const Text = (props: TextProps): ReactElement => {
  const { children, style } = props
  return (
    <StyledText style={style} android_hyphenationFrequency='full' {...props}>
      {children}
    </StyledText>
  )
}

export default Text
