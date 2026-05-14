import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Divider } from 'react-native-paper'
import styled from 'styled-components/native'

import { PoiModel } from 'shared/api'

import Accordion from './Accordion'
import AddressInfo from './AddressInfo'
import Contact from './Contact'
import CustomThumbnail from './CustomThumbnail'
import OpeningHours from './OpeningHours'
import Page from './Page'
import PoiChips from './PoiChips'
import Text from './base/Text'

const PoiDetailsContainer = styled.View<{ experimental_accessibilityOrder?: string[] }>`
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

type PoiDetailsProps = {
  poi: PoiModel
  language: string
  distance: number | null
  onFocus: () => void
}

const PoiDetails = ({ poi, language, distance, onFocus }: PoiDetailsProps): ReactElement => {
  const { t } = useTranslation('pois')
  const { title, content, contacts, openingHours, temporarilyClosed, isCurrentlyOpen, category, appointmentUrl } = poi

  // [4092] accessibilityOrder feature is experimental and could change in the future
  // Used here to fix the the loop that happens between the description accordion and the address copy button.
  // https://reactnative.dev/docs/accessibility#experimental_accessibilityorder
  const accessibilityOrder = [
    ...(content.length > 0 ? ['accessibility-order-description'] : []),
    'accessibility-order-address',
    ...(contacts.length > 0 ? ['accessibility-order-contacts'] : []),
    'accessibility-order-opening-hours',
  ]

  return (
    <PoiDetailsContainer
      accessibilityLabel={`${title} - ${category.name}`}
      onFocus={onFocus}
      screenReaderFocusable
      experimental_accessibilityOrder={accessibilityOrder}>
      <Text variant='h5' style={{ paddingBottom: 4 }}>
        {title}
      </Text>
      {distance !== null && (
        <Text variant='body3' style={{ marginVertical: 8 }}>
          {t('distanceKilometre', { distance: distance.toFixed(1) })}
        </Text>
      )}
      {!!poi.thumbnail && <CustomThumbnail src={poi.thumbnail} />}
      <PoiChips poi={poi} />
      <StyledDivider />
      {content.length > 0 && (
        <>
          <Accordion nativeID='accessibility-order-description' headerContent={t('description')}>
            <Page content={content} language={language} padding={false} />
          </Accordion>
          <StyledDivider />
        </>
      )}
      <AddressInfo location={poi.location} language={language} />
      <StyledDivider />
      {contacts.length > 0 && (
        <>
          <Accordion nativeID='accessibility-order-contacts' headerContent={t('contacts')} initialCollapsed>
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
    </PoiDetailsContainer>
  )
}

export default PoiDetails
