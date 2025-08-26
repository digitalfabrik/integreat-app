import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import InputComponent from './Input'

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const TitleContainer = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const Title = styled('label')`
  font-weight: bold;
`

type InputSectionProps = {
  id: string
  title: string
  description?: string
  showOptional?: boolean
  children: ReactElement<typeof InputComponent>
}

const InputSection = ({ id, showOptional, title, description, children }: InputSectionProps): ReactElement => {
  const { t } = useTranslation('common')
  return (
    <Container>
      <TitleContainer>
        <Title htmlFor={id}>{title}</Title>
        {showOptional && <div>({t('optional')})</div>}
      </TitleContainer>
      {description ? <div>{description}</div> : null}
      {children}
    </Container>
  )
}

export default InputSection
