import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import { PoiModel } from 'shared/api'

import AddressInfo from './AddressInfo'
import Collapsible from './Collapsible'
import Contact from './Contact'
import CustomThumbnail from './CustomThumbnail'
import HorizontalLine from './HorizontalLine'
import OpeningHours from './OpeningHours'
import Page from './Page'
import PoiChips from './PoiChips'

const PoiDetailsContainer = styled.View`
  flex: 1;
  background-color: ${props => props.theme.legacy.colors.backgroundColor};
  gap: 16px;
`

const Title = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${props => props.theme.legacy.colors.textColor};
`

const StyledDistance = styled.Text`
  font-size: 12px;
  color: ${props => props.theme.legacy.colors.textColor};
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
      <HorizontalLine />
      <AddressInfo location={poi.location} language={language} />
      <HorizontalLine />
      {contacts.length > 0 && (
        <>
          <Collapsible headerContent={t('contacts')} language={language}>
            {contacts.map((contact, index) => (
              <Contact
                key={contact.headline ?? contact.website ?? contact.name ?? contact.phoneNumber ?? contact.mobileNumber}
                contact={contact}
                isLastContact={contacts.length - 1 === index}
                language={language}
              />
            ))}
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
      />
      {content.length > 0 && (
        <>
          <Collapsible headerContent={t('description')} language={language}>
            <Page content={content} language={language} padding={false} accessible />
          </Collapsible>
          <HorizontalLine />
        </>
      )}
    </PoiDetailsContainer>
  )
}

export default PoiDetails
