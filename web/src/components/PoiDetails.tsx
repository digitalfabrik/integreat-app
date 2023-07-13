import React, { ReactElement } from 'react'
import { TFunction } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styled, { css, useTheme } from 'styled-components'

import { GeoJsonPoi, getExternalMapsLink, PoiModel } from 'api-client/src'
import { UiDirectionType } from 'translations'

import { EmailIcon, PhoneIcon, WebsiteIcon } from '../assets'
import iconExternalLink from '../assets/IconExternalLink.svg'
import iconMarker from '../assets/IconMarker.svg'
import PoiPlaceholder from '../assets/PoiPlaceholderLarge.jpg'
import dimensions from '../constants/dimensions'
import useWindowDimensions from '../hooks/useWindowDimensions'
import CleanLink from './CleanLink'
import Collapsible from './Collapsible'
import ContactItem from './ContactItem'
import OpeningHours from './OpeningHours'
import RemoteContent from './RemoteContent'
import Spacer from './Spacer'

const DetailsContainer = styled.div`
  font-family: ${props => props.theme.fonts.web.contentFont};
`

const Marker = styled.img<{ direction?: string }>`
  width: 20px;
  height: 20px;
  flex-shrink: 0;

  ${props =>
    props.direction === 'rtl' &&
    css`
      transform: scaleX(-1);
    `};

  @media screen and ${dimensions.mediumLargeViewport} {
    padding: 0 8px;
  }
  object-fit: contain;
`

const Thumbnail = styled.img`
  height: clamp(120px, 14vh, 160px);
  width: 100%;
  flex-shrink: 0;
  border: 1px solid transparent;
  object-fit: cover;
  border-radius: 10px;

  @media screen and ${dimensions.smallViewport} {
    order: 1;
    margin-top: 12px;
  }
`

const Distance = styled.div`
  font-size: clamp(
    ${props => props.theme.fonts.adaptiveFontSizeSmall.min},
    ${props => props.theme.fonts.adaptiveFontSizeSmall.value},
    ${props => props.theme.fonts.adaptiveFontSizeSmall.max}
  );
`

const Category = styled.div`
  font-size: clamp(
    ${props => props.theme.fonts.adaptiveFontSizeSmall.min},
    ${props => props.theme.fonts.adaptiveFontSizeSmall.value},
    ${props => props.theme.fonts.adaptiveFontSizeSmall.max}
  );
  color: ${props => props.theme.colors.textSecondaryColor};
  margin-top: 8px;
`

const AddressContentWrapper = styled.div`
  display: flex;
  font-size: clamp(
    ${props => props.theme.fonts.adaptiveFontSizeSmall.min},
    ${props => props.theme.fonts.adaptiveFontSizeSmall.value},
    ${props => props.theme.fonts.adaptiveFontSizeSmall.max}
  );
`

const AddressContent = styled.div`
  display: flex;
  flex-direction: column;
  font-size: clamp(
    ${props => props.theme.fonts.adaptiveFontSizeSmall.min},
    ${props => props.theme.fonts.adaptiveFontSizeSmall.value},
    ${props => props.theme.fonts.adaptiveFontSizeSmall.max}
  );

  @media ${dimensions.smallViewport} {
    align-self: center;
  }
`

const Heading = styled.div`
  margin: 12px 0;
  font-weight: 700;
`

const Subheading = styled.div`
  margin: 12px 0;
  font-weight: 700;
  font-size: clamp(
    ${props => props.theme.fonts.adaptiveFontSizeSmall.min},
    ${props => props.theme.fonts.adaptiveFontSizeSmall.value},
    ${props => props.theme.fonts.adaptiveFontSizeSmall.max}
  );
`

const LinkContainer = styled.div`
  display: flex;
  margin: 16px 0;
`

const LinkLabel = styled.span`
  color: #0b57d0;
  padding-right: 8px;
  font-size: clamp(
    ${props => props.theme.fonts.adaptiveFontSizeSmall.min},
    ${props => props.theme.fonts.adaptiveFontSizeSmall.value},
    ${props => props.theme.fonts.adaptiveFontSizeSmall.max}
  );
  align-self: flex-end;
`

const HeadingSection = styled.div`
  display: flex;
  flex-direction: column;
`

const DetailSection = styled.div`
  display: flex;
  flex-direction: column;

  @media screen and ${dimensions.smallViewport} {
    flex-direction: row;
    justify-content: space-between;
  }
`

type PoiDetailsProps = {
  feature: GeoJsonPoi
  poi: PoiModel
  direction: UiDirectionType
  t: TFunction<'pois'>
}

const PoiDetails = ({ feature, poi, direction, t }: PoiDetailsProps): ReactElement => {
  const navigate = useNavigate()
  const { viewportSmall } = useWindowDimensions()
  const theme = useTheme()
  const { title, thumbnail, distance } = feature
  const { content, location, website, phoneNumber, email, isCurrentlyOpen, openingHours, temporarilyClosed, category } =
    poi
  // MapEvent parses null to 'null'
  const thumb = thumbnail === 'null' ? null : thumbnail?.replace('-150x150', '')
  const isAndroid = /Android/i.test(navigator.userAgent)
  const externalMapsLink = getExternalMapsLink(location, isAndroid ? 'android' : 'web')

  return (
    <DetailsContainer>
      <HeadingSection>
        <Thumbnail alt='' src={thumb ?? PoiPlaceholder} />
        <Heading>{title}</Heading>
        {!!distance && <Distance>{t('distanceKilometre', { distance })}</Distance>}
        {!!category?.name && <Category>{category.name}</Category>}
      </HeadingSection>
      <Spacer borderColor={theme.colors.poiBorderColor} />
      {!viewportSmall && <Subheading>{t('detailsAddress')}</Subheading>}
      <DetailSection>
        <AddressContentWrapper>
          {!viewportSmall && <Marker src={iconMarker} alt='' direction={direction} />}
          <AddressContent>
            <span>{location.address}</span>
            <span>
              {location.postcode} {location.town}
            </span>
          </AddressContent>
        </AddressContentWrapper>
        <LinkContainer>
          <CleanLink to={externalMapsLink} newTab>
            {!viewportSmall && <LinkLabel>{t('detailsMapLink')}</LinkLabel>}
            <Marker src={iconExternalLink} alt='' direction={direction} />
          </CleanLink>
        </LinkContainer>
      </DetailSection>
      {(!!website || !!phoneNumber || !!email) && (
        <>
          <Spacer borderColor={theme.colors.poiBorderColor} />
          <Collapsible title={t('contactInformation')} direction={direction}>
            <>
              {!!website && (
                <ContactItem iconSrc={WebsiteIcon} iconAlt={t('website')} link={website} content={website} />
              )}
              {!!phoneNumber && (
                <ContactItem
                  iconSrc={PhoneIcon}
                  iconAlt={t('phone')}
                  link={`tel:${phoneNumber}`}
                  content={phoneNumber}
                />
              )}
              {!!email && (
                <ContactItem iconSrc={EmailIcon} iconAlt={t('eMail')} link={`mailto:${email}`} content={email} />
              )}
            </>
          </Collapsible>
        </>
      )}
      <>
        {((openingHours && openingHours.length > 0) || temporarilyClosed) && (
          <Spacer borderColor={theme.colors.poiBorderColor} />
        )}
        <OpeningHours
          direction={direction}
          openingHours={openingHours}
          isCurrentlyOpen={isCurrentlyOpen}
          isTemporarilyClosed={temporarilyClosed}
        />
      </>
      {content.length > 0 && (
        <>
          <Spacer borderColor={theme.colors.poiBorderColor} />
          <Collapsible title={t('detailsInformation')} direction={direction}>
            <RemoteContent html={content} onInternalLinkClick={navigate} smallText />
          </Collapsible>
        </>
      )}
    </DetailsContainer>
  )
}

export default PoiDetails
