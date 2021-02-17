// @flow

import * as React from 'react'
import styled from 'styled-components'
import { type TFunction } from 'react-i18next'
import Tab from './Tab'
import { LOCAL_NEWS, TU_NEWS } from '../constants'
import LocalNewsRouteConfig from '../../../modules/app/route-configs/LocalNewsRouteConfig'
import TunewsRouteConfig from '../../../modules/app/route-configs/TunewsRouteConfig'

const StyledTabs = styled.div`
  display: flex;
  padding-top: 45px;
  padding-bottom: 40px;
`

type PropsType = {|
  type: string,
  children: React.Node,
  city: string,
  localNewsEnabled: boolean,
  tunewsEnabled: boolean,
  language: string,
  t: TFunction
|}

class NewsTabs extends React.PureComponent<PropsType> {
  render () {
    const { children, language, city, localNewsEnabled, tunewsEnabled, t, type } = this.props
    const localNewsPath = new LocalNewsRouteConfig().getRoutePath({ city, language })
    const tunewsPath = new TunewsRouteConfig().getRoutePath({ city, language })

    return (
      <>
        <StyledTabs>
          {
            localNewsEnabled && (
              <Tab
                active={type === LOCAL_NEWS}
                type={LOCAL_NEWS}
                destination={localNewsPath}
                t={t}
              />
            )
          }
          {
            tunewsEnabled && (
              <Tab
                active={type === TU_NEWS}
                type={TU_NEWS}
                destination={tunewsPath}
                t={t}
              />
            )
          }
        </StyledTabs>
        {children}
      </>
    )
  }
}

export default NewsTabs
