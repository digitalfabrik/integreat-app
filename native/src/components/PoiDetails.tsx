import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Divider } from 'react-native-paper'
import styled from 'styled-components/native'

import { PoiModel } from 'shared/api'

import AddressInfo from './AddressInfo'
import Collapsible from './Collapsible'
import Contact from './Contact'
import OpeningHours from './OpeningHours'
import Page from './Page'
import PoiChips from './PoiChips'
import SimpleImage from './SimpleImage'
import Text from './base/Text'

const Thumbnail = styled(SimpleImage)`
  flex: 1;
  height: 180px;
  width: 100%;
  border-radius: 8px;
  margin-bottom: 12px;
`

const PoiDetailsContainer = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
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
      <Text variant='h5' style={{ paddingBottom: 4 }}>
        {title}
      </Text>
      {distance !== null && (
        <Text variant='body3' style={{ marginTop: 8, paddingBottom: 6 }}>
          {t('distanceKilometre', { distance: distance.toFixed(1) })}
        </Text>
      )}
      {!!poi.thumbnail && <Thumbnail source={poi.thumbnail} resizeMode='cover' />}
      <PoiChips poi={poi} />
      <StyledDivider />
      <AddressInfo location={poi.location} language={language} />
      <StyledDivider />
      {contacts.length > 0 && (
        <>
          <Collapsible headerContent={t('contacts')} language={language}>
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
          </Collapsible>

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
          <Collapsible headerContent={t('description')} language={language}>
            <Page content={content} language={language} padding={false} accessible />
          </Collapsible>
          <StyledDivider />
        </>
      )}
    </PoiDetailsContainer>
  )
}

export default PoiDetails
