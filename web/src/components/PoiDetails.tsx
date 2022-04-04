import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { PoiFeature, PoiModel } from 'api-client/src'

import iconArrowBack from '../assets/IconArrowBackLong.svg'
import iconExternalLink from '../assets/IconExternalLink.svg'
import iconMarker from '../assets/IconMarker.svg'
import PoiPlaceholder from '../assets/PoiPlaceholderLarge.jpg'
import updateQueryParams from '../utils/updateQueryParams'
import CleanLink from './CleanLink'
import RemoteContent from './RemoteContent'

const DetailsContainer = styled.div`
  font-family: ${props => props.theme.fonts.web.contentFont};
`

const ArrowBack = styled.img`
  width: 16px;
  height: 14px;
  flex-shrink: 0;
  padding: 0 8px;
  object-fit: contain;
  align-self: center;
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
  cursor: pointer;
`

const DetailsHeaderTitle = styled.span`
  align-self: center;
  white-space: pre;
  padding-left: 8px;
  font-size: clamp(0.55rem, 1.6vh, ${props => props.theme.fonts.hintFontSize});
  font-family: ${props => props.theme.fonts.web.contentFont};
`

const Spacer = styled.hr`
  margin: 12px 0;
  border: 1px solid ${props => props.theme.colors.poiBorderColor};
`

const Thumbnail = styled.img`
  height: clamp(120px, 14vh, 160px);
  width: 100%;
  flex-shrink: 0;
  border: 1px solid transparent;
  object-fit: cover;
  border-radius: 10px;
`

const Distance = styled.div`
  font-size: clamp(0.55rem, 1.6vh, ${props => props.theme.fonts.hintFontSize});
`

const AddressContentWrapper = styled.div`
  display: flex;
  font-size: clamp(0.55rem, 1.6vh, ${props => props.theme.fonts.hintFontSize});
`

const AddressContent = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 16px;
  font-size: clamp(0.55rem, 1.6vh, ${props => props.theme.fonts.hintFontSize});
`

const Heading = styled.div`
  margin: 12px 0;
  font-weight: 700;
`

const Subheading = styled.div`
  margin: 12px 0;
  font-weight: 700;
  font-size: clamp(0.55rem, 1.6vh, ${props => props.theme.fonts.hintFontSize});
`

const LinkContainer = styled.div`
  display: flex;
  margin: 16px 0;
`

const LinkLabel = styled.span`
  color: #0b57d0;
  padding-right: 8px;
  font-size: clamp(0.55rem, 1.6vh, ${props => props.theme.fonts.hintFontSize});
  align-self: flex-end;
`

type PoiDetailsProps = {
  feature: PoiFeature
  poi: PoiModel
  selectFeature: (feature: PoiFeature | null) => void
  setQueryLocation: (location: string | null) => void
}

const PoiDetails: React.FC<PoiDetailsProps> = ({
  feature,
  poi,
  selectFeature,
  setQueryLocation
}: PoiDetailsProps): ReactElement => {
  const onBackClick = () => {
    updateQueryParams()
    selectFeature(null)
    setQueryLocation(null)
  }

  const { title, thumbnail, distance } = feature.properties
  const { content, location } = poi
  const { t } = useTranslation('pois')
  const navigate = useNavigate()
  // MapEvent parses null to 'null'
  const thumb = thumbnail === 'null' ? null : thumbnail?.replace('-150x150', '')
  return (
    <DetailsContainer>
      <DetailsHeader onClick={onBackClick} role='button' tabIndex={0} onKeyPress={onBackClick}>
        <ArrowBack src={iconArrowBack} alt='' />
        <DetailsHeaderTitle>{t('detailsHeader')}</DetailsHeaderTitle>
      </DetailsHeader>
      <Spacer />
      <Thumbnail alt='' src={thumb ?? PoiPlaceholder} />
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
        <CleanLink to={`https://maps.google.com?q=${title}`} newTab>
          <LinkLabel>{t('detailsMapLink')}</LinkLabel>
          <Marker src={iconExternalLink} alt='' />
        </CleanLink>
      </LinkContainer>
      <Spacer />
      <Subheading>{t('detailsInformation')}</Subheading>
      <RemoteContent html={content} onInternalLinkClick={navigate} smallText />
    </DetailsContainer>
  )
}

export default PoiDetails
