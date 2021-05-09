import * as React from "react";
import { Text } from "react-native";
import { WohnenOfferModel, WohnenFormData } from "api-client";
import ListItem from "../../../modules/common/components/ListItem";
import styled from "styled-components/native";
import { formatPrice } from "./OfferDetail";
import type { ThemeType } from "../../../modules/theme/constants";
const Description = styled.View`
  flex: 1;
  flex-direction: column;
`;
const Price = styled.Text`
  align-self: flex-end;
`;
type PropsType = {
  offer: WohnenOfferModel;
  navigateToOffer: () => void;
  theme: ThemeType;
  language: string;
};

class OfferListItem extends React.PureComponent<PropsType> {
  render() {
    const {
      language,
      offer,
      navigateToOffer,
      theme
    } = this.props;

    if (offer.formData instanceof WohnenFormData) {
      const accommodation = offer.formData.accommodation;
      const costs = offer.formData.costs;
      return <ListItem thumbnail={null} title={accommodation.title} navigateTo={navigateToOffer} theme={theme} language={language}>
          <Description>
            <Text>{accommodation.totalArea} m²</Text>
            <Text>{accommodation.totalRooms} Zimmer</Text>
            <Price>{formatPrice(costs.baseRent)} €</Price>
          </Description>
        </ListItem>;
    } else {
      throw new Error(`Failed to render form ${JSON.stringify(offer.formData)} because it is not supported!`);
    }
  }

}

export default OfferListItem;