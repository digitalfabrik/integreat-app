import { DateTime } from 'luxon'
import React, { ReactElement, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { IconButton, List, useTheme } from 'react-native-paper'
import { DatePickerInput, DatePickerModal } from 'react-native-paper-dates'
import styled from 'styled-components/native'

import getInputFormatFromLocale from '../utils/getInputFormatFromLocale'
import Icon from './base/Icon'
import Text from './base/Text'

const DateSection = styled.View`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 16px 8px;
  align-items: center;
`

const StyledButton = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
`

type ResetFilterTextProps = {
  startDate: DateTime | null
  endDate: DateTime | null
}

const ResetFilterText = ({ startDate, endDate }: ResetFilterTextProps) => {
  const { t } = useTranslation('events')
  const text = `${t('resetFilter')} ${startDate ? startDate.toFormat('dd.MM.yyyy') : '∞'} - ${endDate ? endDate.toFormat('dd.MM.yyyy') : '∞'}`
  return (
    <Text variant='h6' style={{ padding: 6 }}>
      {text}
    </Text>
  )
}

type EventsDateFilterProps = {
  startDate: DateTime | null
  setStartDate: (startDate: DateTime | null) => void
  startDateError: string | null
  endDate: DateTime | null
  setEndDate: (startDate: DateTime | null) => void
  modalOpen: boolean
  setModalOpen: (modalOpen: boolean) => void
  languageCode: string
}

const EventsDateFilter = ({
  startDate,
  setStartDate,
  startDateError,
  endDate,
  setEndDate,
  modalOpen,
  setModalOpen,
  languageCode,
}: EventsDateFilterProps): ReactElement => {
  const [showDateFilter, setShowDateFilter] = useState(false)
  const { t } = useTranslation('events')
  const theme = useTheme()

  const onConfirm = useCallback(
    (params: { startDate: Date | undefined; endDate: Date | undefined }) => {
      setModalOpen(false)
      setStartDate(params.startDate ? DateTime.fromJSDate(params.startDate) : null)
      setEndDate(params.endDate ? DateTime.fromJSDate(params.endDate) : null)
    },
    [setEndDate, setModalOpen, setStartDate],
  )

  const onDismiss = useCallback(() => setModalOpen(false), [setModalOpen])

  const chevronIcon = useCallback(
    () => <List.Icon color={theme.colors.primary} icon={showDateFilter ? 'chevron-up' : 'chevron-down'} />,
    [showDateFilter, theme.colors.primary],
  )

  return (
    <>
      <DatePickerModal
        locale={languageCode}
        mode='range'
        visible={modalOpen}
        onDismiss={onDismiss}
        startDate={startDate?.toJSDate() ?? undefined}
        endDate={endDate?.toJSDate() ?? undefined}
        onConfirm={onConfirm}
        calendarIcon='calendar-range'
      />
      <List.Accordion
        title={t(showDateFilter ? 'hideFilters' : 'showFilters')}
        right={chevronIcon}
        expanded={showDateFilter}
        titleStyle={{ fontWeight: 'bold', color: theme.colors.primary }}
        rippleColor='transparent'
        onPress={() => setShowDateFilter(!showDateFilter)}>
        <View style={{ flexDirection: 'row' }}>
          <IconButton
            icon='calendar-range'
            mode='contained'
            onPress={() => setModalOpen(true)}
            style={{ alignSelf: 'center' }}
            accessibilityLabel={t('selectStartDateCalendar')}
          />
          <DateSection>
            <DatePickerInput
              locale={languageCode}
              label={t('from')}
              withDateFormatInLabel={false}
              placeholder={getInputFormatFromLocale(languageCode)}
              value={startDate?.toJSDate() ?? undefined}
              onChange={date => {
                setStartDate(date ? DateTime.fromJSDate(date) : null)
              }}
              onChangeText={date => {
                if (date === '') {
                  setStartDate(null)
                }
              }}
              inputMode='start'
              mode='outlined'
              hasError={!!startDateError}
            />
            <DatePickerInput
              locale={languageCode}
              label={t('to')}
              withDateFormatInLabel={false}
              placeholder={getInputFormatFromLocale(languageCode)}
              value={endDate?.toJSDate() ?? undefined}
              onChange={date => setEndDate(date ? DateTime.fromJSDate(date) : null)}
              onChangeText={date => {
                if (date === '') {
                  setEndDate(null)
                }
              }}
              inputMode='start'
              mode='outlined'
            />
            <View>
              {!!startDateError && (
                <Text variant='body3' style={{ color: theme.colors.error }}>
                  {t(startDateError)}
                </Text>
              )}
            </View>
          </DateSection>
        </View>
      </List.Accordion>
      <>
        {(startDate || endDate) && (
          <StyledButton
            onPress={() => {
              setStartDate(null)
              setEndDate(null)
            }}>
            <Icon source='close' />
            <ResetFilterText startDate={startDate} endDate={endDate} />
          </StyledButton>
        )}
      </>
    </>
  )
}

export default EventsDateFilter
