import styled from '@emotion/styled'
import React, { ReactElement } from 'react'

import Checkbox from './base/Checkbox'

const Container = styled.div`
  flex-direction: row;
  padding: 16px 0;
`

const Divider = styled.hr`
  background-color: ${props => props.theme.colors.borderColor};
  height: 1px;
  border: none;
  margin: 0;
`

type ConsentSectionProps = {
  description: string
  allowed: boolean
  onPress: (permissionGiven: boolean) => void
}

const ConsentSection = ({ description, allowed, onPress }: ConsentSectionProps): ReactElement => (
  <>
    <Container>
      <Checkbox checked={allowed} setChecked={onPress} label={description} />
    </Container>
    <Divider />
  </>
)

export default ConsentSection
