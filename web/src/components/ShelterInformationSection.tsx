import React, { ReactElement } from 'react'
import styled from 'styled-components'

import useWindowDimensions from '../hooks/useWindowDimensions'
import CleanLink from './CleanLink'

const Container = styled.div<{ extended: boolean; separationLine: boolean; elevated: boolean }>`
  ${props => (props.separationLine ? 'border-bottom: 1px solid #d4d4d4;' : '')}
  ${props => (props.elevated ? `background-color: ${props.theme.colors.backgroundColor};` : '')}
  ${props => (props.elevated ? `padding: 12px;` : '')}
  ${props => (props.elevated ? `margin: 16px;` : '')}
  ${props => (props.elevated ? `border-radius: 5px;` : '')}
  ${props => (props.elevated ? `box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.15);` : '')}
  ${props => (props.extended ? 'padding-bottom: 32px;' : '')}
`

const Row = styled.div`
  display: flex;
  flex-flow: row wrap;
`

const RowDetail = styled.div<{ viewportSmall: boolean }>`
  display: grid;
  grid-template-columns: ${props => (props.viewportSmall ? `repeat(1, 1fr)` : `repeat(2, 1fr)`)};
`

const Title = styled.span`
  padding: 16px 12px;
  font-size: 18px;
  font-weight: 700;
`

const TitleHint = styled.span`
  padding: 16px 0;
  margin: 0 8px;
  font-size: 18px;
  color: ${props => props.theme.colors.textSecondaryColor};
`

const Detail = styled.div<{ extended: boolean; to?: string }>`
  padding: 5px 10px;
  display: flex;
  ${props => (props.extended ? 'width: 100%;' : 'width: 220px;')}
`

const DetailText = styled.span<{ hasText: boolean }>`
  margin-left: 16px;
  align-self: ${props => (props.hasText ? 'flex-start' : 'center')};
  ${props => props.hasText && ` font-weight: bold;`};
`

const RightTextContainer = styled.span`
  margin-left: 8px;
`

const Label = styled.span`
  display: flex;
  padding: 0 8px;
  margin: auto 8px auto auto;
  background-color: #74d49e;
  border-radius: 4px;
  color: ${props => props.theme.colors.backgroundColor};
  font-size: 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.15);
`

type InformationType = {
  icon?: string
  text: string
  rightText?: string
  link?: string
}

type Props = {
  title: string
  titleHint?: string
  label?: string
  information: InformationType[]
  children?: ReactElement
  extended: boolean
  elevated?: boolean
  separationLine?: boolean
}

const ShelterInformationSection = ({
  title,
  titleHint,
  label,
  information,
  children,
  extended,
  elevated = false,
  separationLine = false
}: Props): ReactElement => {
  const { viewportSmall } = useWindowDimensions()
  return (
    <Container separationLine={separationLine} extended={extended} elevated={elevated}>
      <Row>
        <Title>{title}</Title>
        {titleHint && <TitleHint>{titleHint}</TitleHint>}
        {label && <Label>{label}</Label>}
      </Row>
      <RowDetail viewportSmall={viewportSmall}>
        {information.map(({ text, icon, rightText, link }) => (
          <Detail key={text} extended={extended} as={link ? CleanLink : 'div'} to={link}>
            {icon && <img alt='' src={icon} />}
            <DetailText hasText={!!rightText}>{text}</DetailText>
            {rightText && <RightTextContainer>{rightText}</RightTextContainer>}
          </Detail>
        ))}
        {children}
      </RowDetail>
    </Container>
  )
}

export default ShelterInformationSection
