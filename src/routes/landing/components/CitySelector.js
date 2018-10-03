// @flow

import * as React from 'react'
import { transform } from 'lodash/object'
import { groupBy } from 'lodash/collection'
import CityModel from 'modules/endpoint/models/CityModel'
import CityEntry from './CityEntry'
import withPlatform from '../../../modules/platform/hocs/withPlatform'
import styled from 'styled-components'

const CityListParent = withPlatform(styled.div`
  position: ${props => props.platform.positionStickyDisabled ? 'static' : 'sticky'};
  height: 30px;
  margin-top: 10px;
  line-height: 30px;
  transition: top 0.2s ease-out;
  background-color: ${props => props.theme.colors.backgroundColor};
  border-bottom: 1px solid ${props => props.theme.colors.themeColor};
`)

type PropsType = {
  cities: Array<CityModel>,
  filterText: string,
  language: string,
  stickyTop: number
}

class CitySelector extends React.PureComponent<PropsType> {
  static defaultProps = {
    stickyTop: 0
  }

  filter (): Array<CityModel> {
    const filterText = this.props.filterText.toLowerCase()
    const cities = this.props.cities

    if (filterText === 'wirschaffendas') {
      return cities.filter(_city => !_city.live)
    } else {
      return cities
        .filter(_city => _city.live)
        .filter(_city => _city.name.toLowerCase().includes(filterText))
    }
  }

  renderList (cities: Array<CityModel>): React.Node {
    const groups = groupBy(cities, city => city.sortCategory)
    return transform(groups, (result, cities, key) => {
      const {language, stickyTop, filterText} = this.props
      result.push(
        <div key={key}>
          <CityListParent style={{top: `${stickyTop}px`}}>{key}</CityListParent>
          {cities.map(city => <CityEntry key={city.code} city={city} language={language} filterText={filterText} />)}
        </div>
      )
    }, [])
  }

  render () {
    return <>
      {this.renderList(this.filter())}
    </>
  }
}

export default CitySelector
