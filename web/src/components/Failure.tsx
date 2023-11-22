import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { SadSmileyIcon } from '../assets'
import Icon from './base/Icon'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  text-align: center;
`

const StyledIcon = styled(Icon)`
  align-self: center;
  width: 64px;
  height: 64px;
`

type FailureProps = {
  errorMessage: string
  goToPath?: string
  goToMessage?: string
}

const Failure = ({ errorMessage, goToPath, goToMessage = 'goTo.start' }: FailureProps): ReactElement => {
  const { t } = useTranslation('error')
  return (
    <Container>
      <StyledIcon src={SadSmileyIcon} />
      <div role='alert'>{t(errorMessage)}</div>
      {!!goToPath && <Link to={goToPath}>{goToMessage ? t(goToMessage) : goToPath}</Link>}
    </Container>
  )
}

export default Failure
