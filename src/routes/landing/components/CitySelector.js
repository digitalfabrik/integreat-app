// @flow

import * as React from 'react'
import { CityListParent } from './CitySelector.styles'
import { transform } from 'lodash/object'
import { groupBy } from 'lodash/collection'
import CityModel from 'modules/endpoint/models/CityModel'
import CityEntry from './CityEntry'

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
