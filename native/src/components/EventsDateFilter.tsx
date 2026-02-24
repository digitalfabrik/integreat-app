import { DateTime } from 'luxon'
import React, { ReactElement, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, StyleSheet } from 'react-native'
import { List, TouchableRipple, useTheme } from 'react-native-paper'
import { DatePickerInput } from 'react-native-paper-dates'

import getInputFormatFromLocale from '../utils/getInputFormatFromLocale'
import Icon from './base/Icon'
import Text from './base/Text'

const styles = StyleSheet.create({
  dateSection: {
    flexDirection: 'column',
    gap: 16,
    marginVertical: 16,
    marginHorizontal: 8,
    width: '80%',
    alignSelf: 'center',
    flex: 1,
    paddingLeft: 0,
  },
  styledButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
})

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
  languageCode: string
}

const EventsDateFilter = ({
  startDate,
  setStartDate,
  startDateError,
  endDate,
  setEndDate,
  languageCode,
}: EventsDateFilterProps): ReactElement => {
  const [showDateFilter, setShowDateFilter] = useState(false)
  const { t } = useTranslation('events')
  const theme = useTheme()

  const filterIcon = useCallback(
    () => <List.Icon color={theme.colors.primary} icon={showDateFilter ? 'arrow-collapse' : 'filter-variant'} />,
    [showDateFilter, theme.colors.primary],
  )

  const chevronIcon = useCallback(
    () => <List.Icon color={theme.colors.primary} icon={showDateFilter ? 'chevron-up' : 'chevron-down'} />,
    [showDateFilter, theme.colors.primary],
  )

  return (
    <>
      <List.Accordion
        title={t(showDateFilter ? 'hideFilters' : 'showFilters')}
        left={filterIcon}
        right={chevronIcon}
        expanded={showDateFilter}
        titleStyle={{ fontWeight: 'bold', color: theme.colors.primary }}
        rippleColor='transparent'
        onPress={() => setShowDateFilter(!showDateFilter)}>
        <View style={styles.dateSection}>
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
          <>
            {!!startDateError && (
              <Text variant='body3' style={{ color: theme.colors.error }}>
                {t(startDateError)}
              </Text>
            )}
          </>
        </View>
      </List.Accordion>
      {(startDate || endDate) && (
        <TouchableRipple
          borderless
          style={styles.styledButton}
          onPress={() => {
            setStartDate(null)
            setEndDate(null)
          }}>
          <>
            <Icon source='close' />
            <ResetFilterText startDate={startDate} endDate={endDate} />
          </>
        </TouchableRipple>
      )}
    </>
  )
}

export default EventsDateFilter
