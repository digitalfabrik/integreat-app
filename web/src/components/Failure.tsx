import styled from '@emotion/styled'
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import Icon from './base/Icon'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  text-align: center;
  padding: 16px 0;
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
  className?: string
}

const Failure = ({ errorMessage, goToPath, goToMessage = 'goTo.start', className }: FailureProps): ReactElement => {
  const { t } = useTranslation('error')
  return (
    <Container className={className}>
      <StyledIcon src={SentimentVeryDissatisfiedIcon} />
      <div role='alert'>{t(errorMessage)} </div>
      {!!goToPath && <Link to={goToPath}>{goToMessage ? t(goToMessage) : goToPath}</Link>}
    </Container>
  )
}

export default Failure
