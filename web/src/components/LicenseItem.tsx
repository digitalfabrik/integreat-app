import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import ListItem from '../components/ListItem'

const LicenseContainer = styled.div`
  padding: 5px 10px;
  line-height: 120%;
`

type PropsType = {
  name: string
  version: string | undefined
  license: string
  onPress: string
}

const LicenseItem = ({ license, name, onPress, version }: PropsType): ReactElement => {
  const { t } = useTranslation('licenses')
  return (
    <ListItem path={onPress} title={name}>
      <LicenseContainer>
        <div>
          {t('version')} {version}
        </div>
        <div>
          {t('license')} {license}
        </div>
      </LicenseContainer>
    </ListItem>
  )
}

export default LicenseItem
