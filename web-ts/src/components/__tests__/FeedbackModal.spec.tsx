import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { FeedbackModal } from "../FeedbackModal";
import { CATEGORIES_ROUTE } from "../../../app/route-configs/CategoriesRouteConfig";
import createLocation from "../../../../createLocation";
import lightTheme from "../../../theme/constants/theme";
import { ThemeProvider } from "styled-components";
jest.mock('react-i18next');
jest.mock('api-client', () => {
  return { ...jest.requireActual('api-client'),
    createFeedbackEndpoint: (baseUrl: string) => ({
      request: () => {}
    })
  };
});
jest.mock('../FeedbackThanksMessage', () => {
  return () => <div>Thanks</div>;
});
describe('FeedbackModal', () => {
  const location = createLocation({
    type: CATEGORIES_ROUTE,
    payload: {
      city: 'augsburg',
      language: 'de'
    }
  });
  const closeFeedbackModal = jest.fn();
  it('should display thanks message after successfully submitting feedback', async () => {
    const {
      getByRole,
      getByText
    } = render(<ThemeProvider theme={lightTheme}>
        <FeedbackModal location={location} path='augsburg/de' closeFeedbackModal={closeFeedbackModal} feedbackRating='up' />
      </ThemeProvider>);
    const button = getByRole('button', {
      name: 'feedback:send'
    });
    fireEvent.click(button);
    // Needed as submitFeedback is asynchronous
    await waitFor(() => expect(button).not.toBeDisabled());
    expect(getByText('Thanks')).toBeTruthy();
  });
});