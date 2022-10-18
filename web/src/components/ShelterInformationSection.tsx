import React, { ReactElement } from 'react'
import styled from 'styled-components'

import useWindowDimensions from '../hooks/useWindowDimensions'
import CleanLink from './CleanLink'
import Tooltip from './Tooltip'

const Container = styled.div<{ extended: boolean; elevated: boolean }>`
  ${props => (props.elevated ? `background-color: ${props.theme.colors.backgroundColor};` : '')}
  ${props => (props.elevated ? `padding: 12px;` : '')}
  ${props => (props.elevated ? `margin: 16px;` : '')}
  ${props => (props.elevated ? `border-radius: 5px;` : '')}
  ${props => (props.elevated ? `box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.15);` : '')}
  ${props => (props.extended ? 'padding-bottom: 32px;' : '')}
  ${props => (props.extended ? 'border-bottom: 1px solid #d4d4d4;' : '')}
`

const Row = styled.div`
  display: flex;
  flex-flow: row wrap;
`

const RowDetail = styled.div<{ singleColumn: boolean }>`
  display: grid;
  grid-template-columns: ${props => (props.singleColumn ? `repeat(1, 1fr)` : `repeat(2, 1fr)`)};
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
  ${props => (props.to ? 'cursor: pointer;' : '')}
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

const StyledTooltip = styled(Tooltip)`
  display: flex;
`

type InformationType = {
  icon?: string
  tooltip?: string
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
  singleColumn?: boolean
}

const ShelterInformationSection = ({
  title,
  titleHint,
  label,
  information,
  children,
  extended,
  elevated = false,
  singleColumn = false,
}: Props): ReactElement => {
  const { viewportSmall } = useWindowDimensions()
  return (
    <Container extended={extended} elevated={elevated}>
      <Row>
        <Title>{title}</Title>
        {!!titleHint && <TitleHint>{titleHint}</TitleHint>}
        {!!label && <Label>{label}</Label>}
      </Row>
      <RowDetail singleColumn={viewportSmall || singleColumn}>
        {information.map(({ text, icon, rightText, link, tooltip }) => {
          const content = (
            <>
              {!!icon && <img alt={tooltip} src={icon} />}
              <DetailText hasText={!!rightText}>{text}</DetailText>
              {!!rightText && <RightTextContainer>{rightText}</RightTextContainer>}
            </>
          )
          return (
            <Detail key={text} extended={extended} as={link ? CleanLink : 'div'} to={link}>
              {tooltip ? (
                <StyledTooltip text={tooltip} flow='up'>
                  {content}
                </StyledTooltip>
              ) : (
                content
              )}
            </Detail>
          )
        })}
        {children}
      </RowDetail>
    </Container>
  )
}

export default ShelterInformationSection
