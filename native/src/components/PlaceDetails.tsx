import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Divider } from 'react-native-paper'
import styled from 'styled-components/native'

import { PlaceModel } from 'shared/api'

import Accordion from './Accordion'
import AddressInfo from './AddressInfo'
import Contact from './Contact'
import CustomThumbnail from './CustomThumbnail'
import OpeningHours from './OpeningHours'
import Page from './Page'
import PlaceChips from './PlaceChips'
import Text from './base/Text'

const PlaceDetailsContainer = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
  gap: 16px;
`

const StyledContactsContainer = styled.View`
  margin-top: 12px;
`

const StyledDivider = styled(Divider)`
  margin: 20px 0;
`

type PlaceDetailsProps = {
  place: PlaceModel
  language: string
  distance: number | null
  onFocus: () => void
}

const PlaceDetails = ({ place, language, distance, onFocus }: PlaceDetailsProps): ReactElement => {
  const { t } = useTranslation('places')
  const { title, content, contacts, openingHours, temporarilyClosed, isCurrentlyOpen, category, appointmentUrl } = place

  return (
    <PlaceDetailsContainer accessibilityLabel={`${title} - ${category.name}`} onFocus={onFocus} screenReaderFocusable>
      <Text variant='h5' style={{ paddingBottom: 4 }}>
        {title}
      </Text>
      {distance !== null && (
        <Text variant='body3' style={{ marginVertical: 8 }}>
          {t('distanceKilometre', { distance: distance.toFixed(1) })}
        </Text>
      )}
      {!!place.thumbnail && <CustomThumbnail src={place.thumbnail} />}
      <PlaceChips place={place} />
      <StyledDivider />
      {content.length > 0 && (
        <>
          <Accordion headerContent={t('description')}>
            <Page content={content} language={language} padding={false} />
          </Accordion>
          <StyledDivider />
        </>
      )}
      <AddressInfo location={place.location} language={language} />
      <StyledDivider />
      {contacts.length > 0 && (
        <>
          <Accordion headerContent={t('contacts')} initialCollapsed>
            <StyledContactsContainer>
              {contacts.map((contact, index) => (
                <Contact
                  key={
                    contact.headline ?? contact.website ?? contact.name ?? contact.phoneNumber ?? contact.mobileNumber
                  }
                  contact={contact}
                  isLastContact={contacts.length - 1 === index}
                />
              ))}
            </StyledContactsContainer>
          </Accordion>

          <StyledDivider />
        </>
      )}
      <OpeningHours
        language={language}
        openingHours={openingHours}
        isCurrentlyOpen={isCurrentlyOpen}
        isTemporarilyClosed={temporarilyClosed}
        appointmentUrl={appointmentUrl}
      />
    </PlaceDetailsContainer>
  )
}

export default PlaceDetails
