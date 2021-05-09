import type { BrowserHistory } from "history";
import { createBrowserHistory } from "history";

const createHistory = (history: BrowserHistory = createBrowserHistory()): BrowserHistory => {
  history.listen((location, action) => {
    // Keep default behavior of restoring scroll position when user:
    // - clicked back button
    // - clicked on a link that programmatically calls `history.goBack()`
    // - manually changed the URL in the address bar (here we might want
    // to scroll to top, but we can't differentiate it from the others)
    if (action === 'POP') {
      return;
    }

    // In all other cases, scroll to top
    window.scrollTo(0, 0);
  });
  return history;
};

export default createHistory;