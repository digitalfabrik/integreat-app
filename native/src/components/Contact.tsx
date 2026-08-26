import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Divider } from 'react-native-paper'
import styled from 'styled-components/native'

import { ContactModel } from 'shared/api'

import OfficeHours from './OfficeHours'
import PlaceDetailRow from './PlaceDetailRow'
import Text from './base/Text'

const StyledDivider = styled(Divider)`
  margin: 20px 0;
`

type ContactProps = {
  contact: ContactModel
  isLastContact?: boolean
}

const Contact = ({
  contact: { headline, website, phoneNumber, email, mobileNumber, officeHours },
  isLastContact,
}: ContactProps): ReactElement => {
  const { t } = useTranslation()

  return (
    <>
      <Text style={{ marginBottom: 8 }}>{headline ?? t($ => $.places.contactInformation)}</Text>
      {!!website && (
        <PlaceDetailRow
          externalUrl={website}
          accessibilityLabel={t($ => $.places.website)}
          text={t($ => $.places.website)}
          icon='earth'
          iconEnd='open-in-new'
        />
      )}
      {!!phoneNumber && (
        <PlaceDetailRow
          externalUrl={`tel:${phoneNumber}`}
          accessibilityLabel={t($ => $.places.phone)}
          text={phoneNumber}
          icon='phone-outline'
        />
      )}
      {!!mobileNumber && (
        <PlaceDetailRow
          externalUrl={`tel:${mobileNumber}`}
          accessibilityLabel={t($ => $.places.mobilePhone)}
          text={mobileNumber}
          icon='cellphone'
        />
      )}
      {!!email && (
        <PlaceDetailRow
          externalUrl={`mailto:${email}`}
          accessibilityLabel={t($ => $.places.eMail)}
          text={email}
          icon='email-outline'
        />
      )}
      {officeHours !== null && <OfficeHours officeHours={officeHours} />}
      {!isLastContact && <StyledDivider />}
    </>
  )
}

export default Contact
