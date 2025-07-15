import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import { PoiModel } from 'shared/api'

import { AccessibleIcon, NotAccessibleIcon, PoiThumbnailPlaceholderLarge } from '../assets'
import AddressInfo from './AddressInfo'
import Collapsible from './Collapsible'
import Contact from './Contact'
import HorizontalLine from './HorizontalLine'
import OpeningHours from './OpeningHours'
import Page from './Page'
import SimpleImage from './SimpleImage'

const Thumbnail = styled(SimpleImage)`
  flex: 1;
  height: 180px;
  width: 100%;
  border-radius: 8px;
  margin-top: 12px;
`

const PoiDetailsContainer = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.backgroundColor};
`

const Title = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${props => props.theme.colors.textColor};
`

const StyledDistance = styled.Text`
  font-size: 12px;
  margin-top: 8px;
  color: ${props => props.theme.colors.textColor};
`

const ChipsContainer = styled.View`
  flex-flow: row wrap;
  gap: 8px;
`

const Chip = styled.View`
  height: 24px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.38);
  flex-direction: row;
  align-items: center;
  gap: 6px;
  padding-inline: 12px;
`

const ChipIcon = styled(SimpleImage)`
  width: 12px;
  height: 12px;
`

const StyledContactsContainer = styled.View`
  margin-top: 12px;
`

type PoiDetailsProps = {
  poi: PoiModel
  language: string
  distance: number | null
}

const PoiDetails = ({ poi, language, distance }: PoiDetailsProps): ReactElement => {
  const { t } = useTranslation('pois')
  const thumbnail = poi.thumbnail ?? PoiThumbnailPlaceholderLarge
  const { title, content, contacts, openingHours, temporarilyClosed, isCurrentlyOpen, category, appointmentUrl } = poi
  const appointmentOverlayUrl =
    appointmentUrl ?? poi.contacts.find(contact => contact.website !== null)?.website ?? null

  const barrierFreeChip =
    poi.barrierFree === true ? (
      <>
        <ChipIcon source={AccessibleIcon} />
        <Text>{t('common:accessible')}</Text>
      </>
    ) : (
      <>
        <ChipIcon source={NotAccessibleIcon} />
        <Text>{t('common:notAccessible')}</Text>
      </>
    )

  return (
    <PoiDetailsContainer accessibilityLabel={`${title} - ${category.name}`}>
      <Title>{title}</Title>
      {distance !== null && (
        <StyledDistance>{t('distanceKilometre', { distance: distance.toFixed(1) })}</StyledDistance>
      )}
      <Thumbnail source={thumbnail} resizeMode='cover' />
      <HorizontalLine />
      <ChipsContainer>
        {poi.barrierFree !== null && <Chip>{barrierFreeChip}</Chip>}
        <Chip>
          <Text>{poi.organization?.name}</Text>
        </Chip>
        <Chip>
          <ChipIcon source={poi.category.icon} />
          <Text>{poi.category.name}</Text>
        </Chip>
      </ChipsContainer>
      <HorizontalLine />
      <AddressInfo location={poi.location} language={language} />
      <HorizontalLine />
      {contacts.length > 0 && (
        <>
          <Collapsible headerContent={t('contacts')} language={language}>
            <StyledContactsContainer>
              {contacts.map((contact, index) => (
                <Contact
                  key={contact.headline ?? contact.website ?? contact.name ?? contact.phoneNumber}
                  contact={contact}
                  isLastContact={contacts.length - 1 === index}
                />
              ))}
            </StyledContactsContainer>
          </Collapsible>

          <HorizontalLine />
        </>
      )}
      <OpeningHours
        language={language}
        openingHours={openingHours}
        isCurrentlyOpen={isCurrentlyOpen}
        isTemporarilyClosed={temporarilyClosed}
        appointmentUrl={appointmentUrl}
        appointmentOverlayLink={appointmentOverlayUrl}
      />
      {content.length > 0 && (
        <>
          <Collapsible headerContent={t('description')} language={language}>
            <Page content={content} language={language} path={poi.path} padding={false} />
          </Collapsible>
          <HorizontalLine />
        </>
      )}
    </PoiDetailsContainer>
  )
}

export default PoiDetails
