import * as React from "react";
import type { FeedbackParamsType, FeedbackType } from "api-client";
import { CATEGORIES_FEEDBACK_TYPE, createFeedbackEndpoint, DEFAULT_FEEDBACK_LANGUAGE, EVENTS_FEEDBACK_TYPE, INTEGREAT_INSTANCE, OFFER_FEEDBACK_TYPE, OFFERS_FEEDBACK_TYPE, PAGE_FEEDBACK_TYPE } from "api-client";
import type { TFunction } from "react-i18next";
import { withTranslation } from "react-i18next";
import type { LocationState } from "redux-first-router";
import FeedbackBox from "./FeedbackBox";
import { EVENTS_ROUTE } from "../../app/route-configs/EventsRouteConfig";
import { OFFERS_ROUTE } from "../../app/route-configs/OffersRouteConfig";
import { CATEGORIES_ROUTE } from "../../app/route-configs/CategoriesRouteConfig";
import { POIS_ROUTE } from "../../app/route-configs/PoisRouteConfig";
import { DISCLAIMER_ROUTE } from "../../app/route-configs/DisclaimerRouteConfig";
import { cmsApiBaseUrl } from "../../app/constants/urls";
import type { SendingStatusType } from "./FeedbackModal";
type PropsType = {
  alias?: string;
  path?: string;
  isPositiveRatingSelected: boolean;
  location: LocationState;
  closeFeedbackModal: () => void;
  sendingStatus: SendingStatusType;
  onSubmit: (sendingStatus: SendingStatusType) => void;
  t: TFunction;
};
type StateType = {
  comment: string;
  contactMail: string;
};

/**
 * Renders a FeedbackBox with all possible feedback options the User can select
 */
export class FeedbackBoxContainer extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      comment: '',
      contactMail: ''
    };
  }

  postFeedbackData = async (feedbackData: FeedbackParamsType) => {
    await createFeedbackEndpoint(cmsApiBaseUrl).request(feedbackData);
  };
  getFeedbackType = (): FeedbackType => {
    const {
      path,
      alias,
      location
    } = this.props;
    const routeType = location.type;

    switch (routeType) {
      case EVENTS_ROUTE:
        return path ? PAGE_FEEDBACK_TYPE : EVENTS_FEEDBACK_TYPE;

      case OFFERS_ROUTE:
        return alias ? OFFER_FEEDBACK_TYPE : OFFERS_FEEDBACK_TYPE;

      case DISCLAIMER_ROUTE:
        return PAGE_FEEDBACK_TYPE;

      case POIS_ROUTE:
        return path ? PAGE_FEEDBACK_TYPE : CATEGORIES_FEEDBACK_TYPE;

      case CATEGORIES_ROUTE:
        return path ? PAGE_FEEDBACK_TYPE : CATEGORIES_FEEDBACK_TYPE;

      default:
        return CATEGORIES_FEEDBACK_TYPE;
    }
  };

  /**
   * Returns the data that should be posted to the feedback endpoint
   */
  getFeedbackData = (comment: string): FeedbackParamsType => {
    const {
      location,
      isPositiveRatingSelected,
      path,
      alias
    } = this.props;
    const {
      city,
      language
    } = location.payload;
    const feedbackType = this.getFeedbackType();
    return {
      feedbackType: feedbackType,
      isPositiveRating: isPositiveRatingSelected,
      comment,
      permalink: path,
      city: city || INTEGREAT_INSTANCE,
      language: language || DEFAULT_FEEDBACK_LANGUAGE,
      alias
    };
  };
  handleCommentChanged = (comment: string) => this.setState({
    comment
  });
  handleContactMailChanged = (contactMail: string) => this.setState({
    contactMail
  });
  submitFeedback = async () => {
    const {
      onSubmit
    } = this.props;
    const {
      comment,
      contactMail
    } = this.state;
    const feedbackData = this.getFeedbackData(`${comment}    Kontaktadresse: ${contactMail || 'Keine Angabe'}`);

    try {
      await this.postFeedbackData(feedbackData);
      onSubmit('SUCCESS');
    } catch (e) {
      console.error(e);
      onSubmit('ERROR');
    }
  };
  handleSubmit = () => {
    this.submitFeedback();
  };

  render() {
    const {
      closeFeedbackModal,
      isPositiveRatingSelected,
      sendingStatus
    } = this.props;
    return <FeedbackBox onCommentChanged={this.handleCommentChanged} onContactMailChanged={this.handleContactMailChanged} onSubmit={this.handleSubmit} sendingStatus={sendingStatus} closeFeedbackModal={closeFeedbackModal} isPositiveRatingSelected={isPositiveRatingSelected} {...this.state} />;
  }

}
export default withTranslation<PropsType>('feedback')(FeedbackBoxContainer);