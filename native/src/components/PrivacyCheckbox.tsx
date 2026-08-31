import React, { ReactElement } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'
import { Checkbox, TouchableRipple } from 'react-native-paper'

import { parseHTML } from 'shared'

import buildConfig from '../constants/buildConfig'
import Link from './Link'
import Text from './base/Text'

const styles = StyleSheet.create({
  TouchableRippleStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
})

type PrivacyCheckboxProps = {
  language: string
  checked: boolean
  setChecked: (checked: boolean) => void
}

const PrivacyCheckbox = ({ language, checked, setChecked }: PrivacyCheckboxProps): ReactElement => {
  const { privacyUrls } = buildConfig()
  const privacyUrl = privacyUrls[language] || privacyUrls.default
  const { t } = useTranslation()
  const accessibilityLabel = parseHTML(
    t($ => $.common.privacyPolicy),
    false,
    { xmlMode: true },
  )
  return (
    <TouchableRipple
      borderless
      onPress={() => setChecked(!checked)}
      role='checkbox'
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked }}
      style={styles.TouchableRippleStyle}>
      <>
        <Checkbox.Android status={checked ? 'checked' : 'unchecked'} onPress={() => setChecked(!checked)} />
        <Text variant='body2' style={{ flex: 1 }}>
          <Trans ns='common' i18nKey={$ => $.common.privacyPolicy}>
            This gets replaced
            <Link url={privacyUrl}>by react-i18next</Link>
          </Trans>
        </Text>
      </>
    </TouchableRipple>
  )
}

export default PrivacyCheckbox
