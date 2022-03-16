import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { PoiFeature, PoiModel } from 'api-client/src'

import iconArrowBack from '../assets/IconArrowBackLong.svg'
import iconExternalLink from '../assets/IconExternalLink.svg'
import iconMarker from '../assets/IconMarker.svg'
import PoiPlaceholder from '../assets/PoiPlaceholderLarge.jpg'
import CleanLink from './CleanLink'

const DetailsContainer = styled.div`
  max-width: 320px;
`

const ArrowBack = styled.img`
  width: 16px;
  height: 14px;
  flex-shrink: 0;
  padding: 0 8px;
  object-fit: contain;
`

const Marker = styled.img`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  padding: 0 8px;
  object-fit: contain;
`

const DetailsHeader = styled.div`
  display: flex;
  padding-top: 12px;
`

const DetailsHeaderTitle = styled.span`
  align-self: center;
  white-space: pre;
  padding-left: 8px;
  font-size: 12px;
  font-family: ${props => props.theme.fonts.web.contentFont};
`

const Spacer = styled.hr`
  color: ${props => props.theme.colors.textDecorationColor};
  margin: 16px 0;
`

const Thumbnail = styled.img`
  height: 120px;
  width: 320px;
  flex-shrink: 0;
  border: 1px solid transparent;
  object-fit: cover;
  border-radius: 10px;
`

const Distance = styled.div`
  font-size: ${props => props.theme.fonts.hintFontSize};
`

const AddressContentWrapper = styled.div`
  display: flex;
  font-size: ${props => props.theme.fonts.hintFontSize};
`

const AddressContent = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 16px;
`

const Heading = styled.div`
  margin: 16px 0;
  font-weight: bold;
`

const Subheading = styled.div`
  margin: 16px 0;
  font-weight: bold;
  font-size: ${props => props.theme.fonts.hintFontSize};
`

const LinkContainer = styled.div`
  display: flex;
  margin: 16px 0;
`

const LinkLabel = styled.span`
  color: #0b57d0;
  font-size: ${props => props.theme.fonts.hintFontSize};
`

const Content = styled.div`
  font-size: ${props => props.theme.fonts.hintFontSize};
`

type PoiDetailsProps = {
  feature: PoiFeature
  poi: PoiModel
  panelHeights: number
}

const PoiDetails: React.FC<PoiDetailsProps> = ({ feature, poi }: PoiDetailsProps): ReactElement => {
  const { title, thumbnail, distance } = feature.properties
  const { content, location } = poi
  const { t } = useTranslation('pois')
  const thumb = thumbnail?.replace('-150x150', '') ?? PoiPlaceholder
  return (
    <DetailsContainer>
      <DetailsHeader>
        <ArrowBack src={iconArrowBack} alt='' />
        <DetailsHeaderTitle>{t('detailsHeader')}</DetailsHeaderTitle>
      </DetailsHeader>
      <Spacer />
      <Thumbnail alt='' src={thumb} />
      <Heading>{title}</Heading>
      {distance && <Distance>{t('distanceKilometre', { distance })}</Distance>}
      <Spacer />
      <Subheading>{t('detailsAddress')}</Subheading>
      <AddressContentWrapper>
        <Marker src={iconMarker} alt='' />
        <AddressContent>
          <span>{location.address}</span>
          <span>
            {location.postcode} {location.town}
          </span>
        </AddressContent>
      </AddressContentWrapper>
      <LinkContainer>
        <CleanLink to='#' newTab>
          <LinkLabel>{t('detailsMapLink')}</LinkLabel>
          <Marker src={iconExternalLink} alt='' />
        </CleanLink>
      </LinkContainer>
      <Spacer />
      <Subheading>{t('detailsInformation')}</Subheading>
      <Content>{content}</Content>
    </DetailsContainer>
  )
}

export default PoiDetails
