import { $Diff } from "utility-types";
import * as React from "react";
import type { StateType } from "../../../modules/app/StateType";
import { connect } from "react-redux";
import { OfferModel, WohnenOfferModel } from "api-client";
import OfferDetail from "../components/OfferDetail";
import Caption from "../../../modules/common/components/Caption";
import FailureSwitcher from "../../../modules/common/components/FailureSwitcher";
import OfferListItem from "../components/OfferListItem";
import List from "../../../modules/common/components/List";
import type { TFunction } from "react-i18next";
import { withTranslation } from "react-i18next";
import { hash as hashFunction } from "../../../modules/app/route-configs/WohnenRouteConfig";
type OwnPropsType = {
  wohnenOffers: Array<WohnenOfferModel>;
  offers: Array<OfferModel>;
};
type PropsType = OwnPropsType & {
  city: string;
  language: string;
  wohnenOfferHash?: string;
  t: TFunction;
};
export class WohnenOfferPage extends React.Component<PropsType> {
  renderOfferListItem = ({
    city,
    language,
    hashFunction
  }: {
    city: string;
    language: string;
    hashFunction: (arg0: WohnenOfferModel) => string;
  }) => (offer: WohnenOfferModel) => <OfferListItem key={hashFunction(offer)} offer={offer} language={language} city={city} hashFunction={hashFunction} />;

  render() {
    const {
      wohnenOffers,
      offers,
      city,
      language,
      wohnenOfferHash,
      t
    } = this.props;
    const offer: OfferModel | void = offers.find(offer => offer.alias === 'wohnen');

    if (!offer) {
      return <FailureSwitcher error={new Error('The Wohnen offer is not supported.')} />;
    }

    if (wohnenOfferHash) {
      const wohnenOffer = wohnenOffers.find(_wohnenOffer => hashFunction(_wohnenOffer) === wohnenOfferHash);

      if (!wohnenOffer) {
        return <FailureSwitcher error={new Error('Angebot nicht gefunden.')} />;
      }

      return <OfferDetail offer={wohnenOffer} />;
    }

    return <>
        <Caption title={offer.title} />
        <List noItemsMessage={t('noOffersAvailable')} items={wohnenOffers} renderItem={this.renderOfferListItem({
        city,
        language,
        hashFunction
      })} />
      </>;
  }

}

const mapStateToProps = (state: StateType) => ({
  city: state.location.payload.city,
  language: state.location.payload.language,
  wohnenOfferHash: state.location.payload.offerHash
});

export default connect<$Diff<PropsType, {
  t: TFunction;
}>, OwnPropsType, _, _, _, _>(mapStateToProps, () => ({}))(withTranslation<PropsType>('wohnen')(WohnenOfferPage));