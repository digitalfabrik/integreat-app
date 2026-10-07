# Bescheid-Checker's route is independent of the current region

The Bescheid-Checker is opened via a FAB on a region content page, the same way chat is, but unlike chat (and every other content route, all of which follow `/:regionCode/:languageCode/...`) its route is `/bescheid-checker/:languageCode` — no `regionCode` segment, mirroring the existing region-independent `REGIONS_ROUTE` pattern instead.

We chose this because analyzing a Bescheid and matching counseling options isn't actually tied to whichever Integreat region the user happened to be browsing: the relevant "location" for counseling matching is captured explicitly in the Counseling Profile (which defaults to, but can be changed away from, the originating region) rather than locked to the URL. The originating region and page are instead passed as an explicit query param when the FAB opens the tool, used only for the back button and the Counseling Profile's default region.
