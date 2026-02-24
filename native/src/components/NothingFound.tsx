import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import Icon from './base/Icon'
import Text from './base/Text'

const Container = styled.View<{ paddingTop: boolean }>`
  padding-top: ${props => (props.paddingTop ? '20px' : 0)};
`

const StyledIcon = styled(Icon)`
  margin: 10px auto;
`

type NothingFoundProps = {
  paddingTop?: boolean
}

const NothingFound = ({ paddingTop = false }: NothingFoundProps): ReactElement => {
  const { t } = useTranslation('search')
  return (
    <Container paddingTop={paddingTop}>
      <StyledIcon size={60} source='emoticon-sad-outline' />
      <Text
        variant='body1'
        role='alert'
        style={{
          textAlign: 'center',
          padding: 12,
          paddingHorizontal: 28,
        }}>
        {t('search:nothingFound')}
      </Text>
    </Container>
  )
}

export default NothingFound
