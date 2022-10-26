import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import ListItem from '../components/ListItem'

const LicenseContainer = styled.div`
  padding: 5px 10px;
  line-height: 120%;
`

type LicenseItemProps = {
  name: string
  version: string | undefined
  license: string
  licenseUrl: string
}

const LicenseItem = ({ license, name, licenseUrl, version }: LicenseItemProps): ReactElement => {
  const { t } = useTranslation('licenses')
  return (
    <ListItem path={licenseUrl} title={name}>
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
