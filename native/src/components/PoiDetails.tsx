import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Divider } from 'react-native-paper'
import styled from 'styled-components/native'

import { PoiModel } from 'shared/api'

import Accordion from './Accordion'
import AddressInfo from './AddressInfo'
import Contact from './Contact'
import CustomThumbnail from './CustomThumbnail'
import HorizontalLine from './HorizontalLine'
import OpeningHours from './OpeningHours'
import Page from './Page'
import PoiChips from './PoiChips'

const PoiDetailsContainer = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
  gap: 16px;
`

const Title = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${props => props.theme.colors.onSurface};
  padding-bottom: 4px;
`

const StyledDistance = styled.Text`
  font-size: 12px;
  margin-top: 8px;
  padding-bottom: 6px;
  color: ${props => props.theme.colors.onSurface};
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

  return (
    <PoiDetailsContainer accessibilityLabel={`${title} - ${category.name}`} onFocus={onFocus} focusable>
      <Title>{title}</Title>
      {distance !== null && (
        <StyledDistance>{t('distanceKilometre', { distance: distance.toFixed(1) })}</StyledDistance>
      )}
      {!!poi.thumbnail && <CustomThumbnail src={poi.thumbnail} />}
      <PoiChips poi={poi} />
      <StyledDivider />
      <AddressInfo location={poi.location} language={language} />
      <StyledDivider />
      {contacts.length > 0 && (
        <>
          <Accordion headerContent={t('contacts')}>
            <StyledContactsContainer>
            {contacts.map((contact, index) => (
              <Contact
                key={contact.headline ?? contact.website ?? contact.name ?? contact.phoneNumber ?? contact.mobileNumber}
                contact={contact}
                isLastContact={contacts.length - 1 === index}
                language={language}
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
      {content.length > 0 && (
        <>
          <Accordion headerContent={t('description')}>
            <Page content={content} language={language} padding={false} accessible />
          </Accordion>
          <StyledDivider />
        </>
      )}
    </PoiDetailsContainer>
  )
}

export default PoiDetails
