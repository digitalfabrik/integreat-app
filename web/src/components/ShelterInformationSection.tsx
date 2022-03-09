import React, { ReactElement } from 'react'
import styled from 'styled-components'

const Container = styled.div<{ extended: boolean; separationLine: boolean }>`
  ${props => (props.extended ? 'padding-bottom: 24px;' : '')}
  ${props => (props.separationLine ? 'border-bottom: 1px solid #d4d4d4;' : '')}
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`

const Title = styled.span`
  padding: 16px 0;
  font-size: 18px;
  font-weight: 700;
`

const TitleHint = styled.span`
  padding: 16px 0;
  margin: 0 8px;
  font-size: 18px;
  color: ${props => props.theme.colors.textSecondaryColor};
`

const Detail = styled.span<{ extended: boolean }>`
  padding: 0 10px;
  flex-direction: row;
  ${props => (props.extended ? 'width: 100%;' : 'width: 220px;')}
`

const Description = styled.span`
  display: flex;
  flex: 1;
  width: 50%;
`

const Label = styled.span`
  display: flex;
  padding: 0 8px;
  margin: auto 0 auto auto;
  background-color: #74d49e;
  border-radius: 4px;
  color: ${props => props.theme.colors.backgroundColor};
  font-size: 14px;
`

type InformationType = {
  icon?: string
  text: string
  rightText?: string
}

type Props = {
  title: string
  titleHint?: string
  label?: string
  information: InformationType[]
  children?: ReactElement
  extended: boolean
  separationLine?: boolean
}

const ShelterInformationSection = ({
  title,
  titleHint,
  label,
  information,
  children,
  extended,
  separationLine = false
}: Props): ReactElement => (
  <Container separationLine={separationLine} extended={extended}>
    <Row>
      <Title>{title}</Title>
      {titleHint && <TitleHint>{titleHint}</TitleHint>}
      {label && <Label>{label}</Label>}
    </Row>
    <Row>
      {information.map(({ text, icon, rightText }) => (
        <Detail key={text} extended={extended}>
          {icon && <img alt='' src={icon} />}
          {/* TODO Text should be shown at the right half of the item */}
          {text}
          {rightText ?? ''}
        </Detail>
      ))}
      {children}
    </Row>
  </Container>
)

export default ShelterInformationSection
