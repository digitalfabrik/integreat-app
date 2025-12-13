import React, { ReactElement } from 'react'
import styled, { useTheme } from 'styled-components/native'

import Text from './base/Text'

// Wrapper is necessary, because iOS doesn't display border for Text components.
const BorderWrapper = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.secondary};
  flex-flow: column wrap;
  align-items: flex-start;
`

type CityGroupProps = {
  children: string
}

const CityGroup = ({ children }: CityGroupProps): ReactElement => {
  const theme = useTheme()
  return (
    <BorderWrapper>
      <Text
        variant='body2'
        style={{
          marginTop: 5,
          paddingVertical: 10,
          fontFamily: theme.legacy.fonts.native.decorativeFontRegular,
        }}>
        {children}
      </Text>
    </BorderWrapper>
  )
}

export default CityGroup
