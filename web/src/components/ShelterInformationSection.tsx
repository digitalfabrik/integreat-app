import React, { ReactElement } from 'react'
import styled from 'styled-components'

import useWindowDimensions from '../hooks/useWindowDimensions'

const Container = styled.div<{ extended: boolean; separationLine: boolean; elevated: boolean }>`
  ${props => (props.extended ? 'padding-bottom: 24px;' : '')}
  ${props => (props.separationLine ? 'border-bottom: 1px solid #d4d4d4;' : '')}
  ${props => (props.elevated ? `background-color: ${props.theme.colors.backgroundColor};` : '')}
  ${props => (props.elevated ? `padding: 12px;` : '')}
  ${props => (props.elevated ? `margin: 16px;` : '')}
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

const Detail = styled.div<{ extended: boolean }>`
  padding: 5px 10px;
  display: flex;
  ${props => (props.extended ? 'width: 100%;' : 'width: 220px;')}
`

const DetailText = styled.span<{ bold: boolean }>`
  margin-left: 16px;
  align-self: center;
  ${props => props.bold && ` font-weight: bold;`};
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
        {information.map(({ text, icon, rightText }) => (
          <Detail key={text} extended={extended}>
            {icon && <img alt='' src={icon} />}
            {/* TODO IGAPP-944: Text should be shown at the right half of the item */}
            <DetailText bold={rightText}>{text}</DetailText>
            {rightText && <RightTextContainer>{rightText}</RightTextContainer>}
          </Detail>
        ))}
        {children}
      </RowDetail>
    </Container>
  )
}

export default ShelterInformationSection
