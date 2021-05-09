import React from "react";
import type { TFunction } from "react-i18next";
import { withTranslation } from "react-i18next";
import LanguageSelector from "../../../modules/common/containers/LanguageSelector";
import { CityModel } from "api-client";
import Caption from "../../../modules/common/components/Caption";
import type { LocationState } from "redux-first-router";
import type { StyledComponent } from "styled-components";
import styled from "styled-components";
import type { LanguageChangePathsType } from "../../app/containers/Switcher";
import type { ThemeType } from "build-configs/ThemeType";
const ChooseLanguage: StyledComponent<{}, ThemeType, any> = styled.p`
  margin: 25px 0;
  text-align: center;
`;
type PropsType = {
  cities: Array<CityModel>;
  location: LocationState;
  languageChangePaths: LanguageChangePathsType;
  t: TFunction;
};
export class LanguageFailure extends React.PureComponent<PropsType> {
  render() {
    const {
      t,
      location,
      cities,
      languageChangePaths
    } = this.props;
    const title = cities && CityModel.findCityName(cities, location.payload.city);
    return <>
        {title && <Caption title={title} />}
        <ChooseLanguage>{`${t('notFound.language')} ${t('chooseALanguage')}`}</ChooseLanguage>
        <LanguageSelector isHeaderActionItem={false} location={location} languageChangePaths={languageChangePaths} />
      </>;
  }

}
export default withTranslation<PropsType>('error')(LanguageFailure);