import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { pathnameFromRouteInformation, LANDING_ROUTE } from 'shared'

import useCityContentParams from '../hooks/useCityContentParams'
import CityContentFooter from './CityContentFooter'
import ContrastThemeToggle from './ContrastThemeToggle'
import Sidebar from './Sidebar'
import SidebarActionItem from './SidebarActionItem'
import Link from './base/Link'
import List from './base/List'

const CityContentSidebar = (): ReactElement => {
  const [open, setOpen] = useState(false)
  const { cityCode, languageCode } = useCityContentParams()
  const { t } = useTranslation('layout')

  const landingPath = pathnameFromRouteInformation({ route: LANDING_ROUTE, languageCode })

  return (
    <Sidebar
      setOpen={setOpen}
      open={open}
      Footer={<CityContentFooter city={cityCode} language={languageCode} mode='sidebar' />}>
      <List
        Items={[
          <Link key='location' to={landingPath}>
            <SidebarActionItem text={t('changeLocation')} iconSrc={LocationOnOutlinedIcon} />
          </Link>,
          <ContrastThemeToggle key='contrastTheme' />,
        ]}
      />
    </Sidebar>
  )
}

export default CityContentSidebar
