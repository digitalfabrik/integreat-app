# Deployment

## Deployment to web.
1. Create new release on Jira (should be empty)
2. Update old issues to use the created release as Fix Version
   * Query to find issues which haven't been released: `project = "integreat-webapp" AND issuetype = Task AND Sprint IS NOT EMPTY AND fixVersion IS EMPTY AND resolution = Done`
3. Release the Jira release
4. Generate release notes in Jira

5. Create a branch and create a Pull Request to develop:
    * Update version number e.g. "2018.03.02" in package.json
6. Merge branch in develop

7. Create Pull Request to merge develop in master:
8. Merge develop in master

9. The app gets deployed automatically to  [integreat.app](https://integreat.app/) by our jenkins.


10. Tag the master HEAD as "2018.03.02". Add the release notes from Jira as description.
11. Send release notes to Slack channel #app-web

## Deployment to webnext.
When pushing to any branch a [jenkins](https://build.integreat-app.de/job/integreat-webapp/) build ist triggered. When 
pushing to **develop** the app also gets deployed to  [webnext.integreat-app.de](https://webnext.integreat-app.de/). 
