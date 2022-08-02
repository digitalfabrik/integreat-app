import moment from 'moment'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { ShelterModel } from 'api-client'

import accessibleIcon from '../../../assets/icons/accessible.svg'
import bathroomIcon from '../../../assets/icons/bathroom.svg'
import bedIcon from '../../../assets/icons/bed.svg'
import calendarIcon from '../../../assets/icons/calendar.svg'
import emailIcon from '../../../assets/icons/email.svg'
import euroIcon from '../../../assets/icons/euro.svg'
import houseIcon from '../../../assets/icons/house.svg'
import keyIcon from '../../../assets/icons/key.svg'
import lgbtqiIcon from '../../../assets/icons/lgbtqi.svg'
import petIcon from '../../../assets/icons/pet.svg'
import phoneIcon from '../../../assets/icons/phone.svg'
import smokingIcon from '../../../assets/icons/smoking.svg'
import timerIcon from '../../../assets/icons/timer.svg'
import Caption from './Caption'
import ShelterContactRequestForm from './ShelterContactRequestForm'
import ShelterInformationSection from './ShelterInformationSection'
import { StyledButton } from './TextButton'
import Tooltip from './Tooltip'

const FullWidth = styled.div`
  flex: 1;
`

const Container = styled.article`
  margin: 12px;
  padding: 16px 12px 28px;
  background-color: #f8f8f8;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.15);
`

const DetailButton = styled(StyledButton)`
  margin-left: 8px;
  margin-bottom: 0;
`

const Detail = styled.div`
  padding: 0 12px;
  margin-top: 10px;
  flex-direction: row;
  display: flex;
`

const IconContainer = styled.div`
  margin-right: 18px;
`

type IconWithTooltipProps = {
  tooltip: string
  icon: string
}

const IconWithTooltip = ({ tooltip, icon }: IconWithTooltipProps): ReactElement => (
  <IconContainer>
    <Tooltip text={tooltip} flow='up'>
      <img alt={tooltip} src={icon} width='20px' height='20px' />
    </Tooltip>
  </IconContainer>
)

type Props = {
  shelter: ShelterModel
  extended?: boolean
  cityCode: string
}

const ShelterInformation = ({ shelter, cityCode, extended = false }: Props): ReactElement => {
  const { beds, city, id, accommodationType, period, startDate, info, rooms, occupants, name } = shelter
  const { zipcode, hostType, languages, email, phone, comments, costs } = shelter
  const { t } = useTranslation('shelter')

  const notSpecified = t('notSpecified')
  const bedsText = beds === 1 ? t('bed') : t('beds', { beds })
  const titleText = t('shelterTitle', { beds: bedsText, location: city })
  const titleHint = `(#${id})`
  const startDateText = moment(startDate, 'DD.MM.YYYY').isSameOrBefore(moment.now())
    ? t('now')
    : `${t('starting')} ${startDate}`

  const allowedPets = info.filter(it => it.includes('haustier'))
  const petsTooltip = allowedPets.length === 2 ? t('haustier') : t(allowedPets[0] ?? 'notSpecified')
  const petsAllowed = allowedPets.length !== 0

  const languagesText = languages.length !== 0 ? languages.map(it => t(it)).join(', ') : notSpecified
  const isFree = costs !== 'kostenpflichtig'
  const tenancyPossible = costs === 'uebergang-miete'

  return (
    <FullWidth dir='auto'>
      {extended && <Caption title={`${titleText} (#${id})`} />}
      <Container>
        <ShelterInformationSection
          extended={extended}
          title={extended ? t('shelterInformation') : titleText}
          titleHint={extended ? undefined : titleHint}
          label={isFree ? t('free') : undefined}
          information={[
            { text: t(accommodationType), icon: houseIcon, tooltip: t('shelterType') },
            { text: bedsText, icon: bedIcon, tooltip: t('availableBeds') },
            { text: startDateText, icon: calendarIcon, tooltip: t('startDate') },
            { text: t(period), icon: timerIcon, tooltip: t('duration') },
            ...(extended ? [{ text: t(isFree ? 'free' : 'withCosts'), icon: euroIcon }] : []),
            ...(extended && tenancyPossible ? [{ text: t('tenancyPossible'), icon: keyIcon }] : []),
          ]}>
          <Detail>
            {info.includes('bad') && <IconWithTooltip tooltip={t('bathroom')} icon={bathroomIcon} />}
            {info.includes('lgbtiq') && <IconWithTooltip tooltip={t('lgbtiq')} icon={lgbtqiIcon} />}
            {info.includes('barrierefrei') && <IconWithTooltip tooltip={t('accessible')} icon={accessibleIcon} />}
            {petsAllowed && <IconWithTooltip tooltip={petsTooltip} icon={petIcon} />}
            {info.includes('rauchen') && <IconWithTooltip tooltip={t('smoking')} icon={smokingIcon} />}
          </Detail>
        </ShelterInformationSection>
        {extended && (
          <>
            <ShelterInformationSection
              extended={extended}
              title={t('householdInformation')}
              information={[
                { text: t('rooms'), rightText: rooms?.toString() ?? notSpecified },
                { text: t('occupants'), rightText: occupants?.toString() ?? notSpecified },
                ...(occupants !== 0 ? [{ text: t('hostType'), rightText: hostType ? t(hostType) : notSpecified }] : []),
              ]}
            />
            <ShelterInformationSection
              extended={extended}
              title={t('hostInformation')}
              information={[
                { text: t('name'), rightText: name },
                { text: t('zipcode'), rightText: zipcode },
                { text: t('city'), rightText: city },
                { text: t('languages'), rightText: languagesText },
              ]}
            />
            {comments && (
              <ShelterInformationSection title={t('comments')} information={[{ text: comments }]} extended={extended} />
            )}
            {email || phone ? (
              <ShelterInformationSection
                extended={extended}
                title={t('contactInformation').toUpperCase()}
                elevated
                information={[
                  { icon: emailIcon, text: email ?? notSpecified, link: email ? `mailto:${email}` : undefined },
                  { icon: phoneIcon, text: phone ?? notSpecified, link: phone ? `tel:${phone}` : undefined },
                ]}
              />
            ) : (
              <ShelterContactRequestForm shelterId={id} cityCode={cityCode} />
            )}
          </>
        )}
        {!extended && (
          <DetailButton onClick={() => undefined} disabled={false}>
            {t('shelterButton')}
          </DetailButton>
        )}
      </Container>
    </FullWidth>
  )
}

export default ShelterInformation
