import styled from '@emotion/styled'
import Divider from '@mui/material/Divider'
import React, { ReactElement } from 'react'

import Checkbox from './base/Checkbox'

const Container = styled.div`
  flex-direction: row;
  padding: 16px 0;
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
