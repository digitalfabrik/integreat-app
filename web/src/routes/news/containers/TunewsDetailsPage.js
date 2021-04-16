// @flow

import * as React from 'react'
import { push } from 'redux-first-router'
import styled, { type StyledComponent } from 'styled-components'
import TunewsIcon from './../assets/TunewsActiveLogo.png'
import { CityModel, NotFoundError, TunewsModel } from 'api-client'
import { connect } from 'react-redux'
import type { StateType } from '../../../modules/app/StateType'
import TunewsDetailsFooter from '../components/TunewsDetailsFooter'
import FailureSwitcher from '../../../modules/common/components/FailureSwitcher'
import { useContext } from 'react'
import DateFormatterContext from '../../../modules/i18n/context/DateFormatterContext'
import { TU_NEWS_TYPE } from 'api-client/src/routes'
import type { ThemeType } from 'build-configs/ThemeType'
import Page from '../../../modules/common/components/Page'
import { lastUpdateDateFormat } from '../../../modules/common/constants/news'

const StyledContainer: StyledComponent<{||}, ThemeType, *> = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const StyledWrapper: StyledComponent<{||}, ThemeType, *> = styled.div`
  padding-bottom: 50px;
`
const StyledBanner: StyledComponent<{||}, ThemeType, *> = styled.div`
  position: relative;
  display: flex;
  height: 60px;
  overflow: hidden;
  align-items: center;
  margin: 25px 0;
  background-color: ${({ theme }) => theme.colors.tunewsThemeColorLight};
  border-radius: 11px;
`
const StyledBannerImage: StyledComponent<{||}, ThemeType, *> = styled.img`
  max-height: 100%;
`
const StyledTitle: StyledComponent<{||}, ThemeType, *> = styled.div`
  display: flex;
  width: 205px;
  height: 100%;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.tunewsThemeColor};
  color: ${({ theme }) => theme.colors.backgroundColor};
  font-size: 20px;
  font-weight: 700;
`

type PropsType = {|
  tunewsElement: TunewsModel,
  language: string,
  id: number,
  city: string,
  cities: Array<CityModel>
|}

export const TunewsDetailsPage = ({ tunewsElement, language, id, city, cities }: PropsType) => {
  const formatter = useContext(DateFormatterContext)
  const currentCity: ?CityModel = cities && cities.find(cityElement => cityElement.code === city)
  if (!currentCity || !currentCity.tunewsEnabled) {
    const error = new NotFoundError({ type: 'category', id: id.toString(), city, language })
    return <FailureSwitcher error={error} />
  } else if (!tunewsElement) {
    const error = new NotFoundError({ type: TU_NEWS_TYPE, id: id.toString(), city, language })
    return <FailureSwitcher error={error} />
  }

  const { title, content, date, eNewsNo } = tunewsElement
  // Removes Last Update Timestamp in content
  const filterPattern = `<p>${eNewsNo}</p>`;
  const filteredContent = content.replace(filterPattern,"");

  return (
    <StyledContainer>
      <StyledWrapper>
        <StyledBanner>
          <StyledTitle>
            <StyledBannerImage src={TunewsIcon} alt='' />
          </StyledTitle>
        </StyledBanner>
        <Page
          title={title}
          content={filteredContent}
          formatter={formatter}
          lastUpdateFormat={lastUpdateDateFormat}
          lastUpdate={date}
          showLastUpdateText={false}
          onInternalLinkClick={push}
        />
      </StyledWrapper>
      <TunewsDetailsFooter eNewsNo={eNewsNo} date={date} formatter={formatter} />
    </StyledContainer>
  )
}

const mapStateToProps = (state: StateType) => ({
  language: state.location.payload.language,
  id: state.location.payload.id,
  city: state.location.payload.city,
  cities: state.cities.data
})

export default connect<PropsType, *, *, *, *, *>(mapStateToProps)(TunewsDetailsPage)
