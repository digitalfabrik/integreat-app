import ContrastIcon from '@mui/icons-material/Contrast'
import LocationOnIcon from '@mui/icons-material/LocationOnOutlined'
import { useTheme } from '@mui/material/styles'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { pathnameFromRouteInformation, LANDING_ROUTE } from 'shared'

import useCityContentParams from '../hooks/useCityContentParams'
import CityContentFooter from './CityContentFooter'
import Sidebar from './Sidebar'
import SidebarActionItem from './SidebarActionItem'
import List from './base/List'

const CityContentSidebar = (): ReactElement => {
  const [open, setOpen] = useState(false)
  const { cityCode, languageCode } = useCityContentParams()
  const { toggleTheme } = useTheme()
  const { t } = useTranslation('layout')

  const landingPath = pathnameFromRouteInformation({ route: LANDING_ROUTE, languageCode })

  return (
    <Sidebar
      setOpen={setOpen}
      open={open}
      Footer={<CityContentFooter city={cityCode} language={languageCode} mode='sidebar' />}>
      <List
        Items={[
          <SidebarActionItem
            key='changeLocation'
            text={t('changeLocation')}
            icon={<LocationOnIcon />}
            to={landingPath}
          />,
          <SidebarActionItem
            key='contrastTheme'
            text={t('contrastTheme')}
            icon={<ContrastIcon />}
            onClick={toggleTheme}
          />,
        ]}
      />
    </Sidebar>
  )
}

export default CityContentSidebar
