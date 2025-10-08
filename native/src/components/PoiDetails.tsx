import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { withKeyboardFocus } from 'react-native-external-keyboard'
import styled from 'styled-components/native'

import { PoiModel } from 'shared/api'

import { PoiThumbnailPlaceholderLarge } from '../assets'
import AddressInfo from './AddressInfo'
import Collapsible from './Collapsible'
import Contact from './Contact'
import HorizontalLine from './HorizontalLine'
import OpeningHours from './OpeningHours'
import Page from './Page'
import PoiChips from './PoiChips'
import SimpleImage from './SimpleImage'

const Thumbnail = styled(SimpleImage)`
  flex: 1;
  height: 180px;
  width: 100%;
  border-radius: 8px;
  margin: 12px 0;
`

const PoiDetailsContainer = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.backgroundColor};
`

const KeyboardFocusableContainer = withKeyboardFocus(PoiDetailsContainer)

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

const StyledContactsContainer = styled.View`
  margin-top: 12px;
`

type PoiDetailsProps = {
  poi: PoiModel
  language: string
  distance: number | null
  onFocus: () => void
}

const PoiDetails = ({ poi, language, distance, onFocus }: PoiDetailsProps): ReactElement => {
  const { t } = useTranslation('pois')
  const thumbnail = poi.thumbnail ?? PoiThumbnailPlaceholderLarge
  const { title, content, contacts, openingHours, temporarilyClosed, isCurrentlyOpen, category, appointmentUrl } = poi

  return (
    <KeyboardFocusableContainer accessibilityLabel={`${title} - ${category.name}`} onFocus={onFocus} focusable>
      <Title>{title}</Title>
      {distance !== null && (
        <StyledDistance>{t('distanceKilometre', { distance: distance.toFixed(1) })}</StyledDistance>
      )}
      <Thumbnail source={thumbnail} resizeMode='cover' />
      <PoiChips poi={poi} />
      <HorizontalLine />
      <AddressInfo location={poi.location} language={language} />
      <HorizontalLine />
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
            <Page content={content} language={language} path={poi.path} padding={false} accessible />
          </Collapsible>
          <HorizontalLine />
        </>
      )}
    </KeyboardFocusableContainer>
  )
}

export default PoiDetails
