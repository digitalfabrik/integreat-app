# Continuous Integration and Delivery
## Content
* [Deliver a new release](#triggering-a-delivery-using-the-ci)
* [Workflows](#workflows)
* [Determining the next version](#determining-the-next-version)
* [Used services](#services)
* [Hints and quirks](#hints-and-quirks)

## Triggering a Delivery using the CI

The easiest way to deliver a new build to production or development is to trigger the corresponding CircleCI workflows
(*api_triggered_development_delivery* and *api_triggered_production_delivery* depending on the `production_delivery` parameter):

* Get a CircleCI [Personal API Token](https://circleci.com/docs/2.0/managing-pi-tokens/).
* Trigger a build using the tool [trigger-pipeline.sh](../.circleci/trigger-pipeline).
If no branch is specified, develop is used as default.
* For more information on how to use it, execute it without parameters to see usage information.

## Workflows

See the table below for a detailed overview of all existing workflows:

|Workflow|Trigger|Checks|Builds|Bump version|Delivery|
|---|---|---|---|---|---|
|commit|Every PR-commit|:heavy_check_mark:|:heavy_check_mark:|:x:|Development (develop only)|
|bi_weekly_production_delivery|Bi weekly cron|:heavy_check_mark:|:heavy_check_mark:|:heavy_check_mark:|Production|
|api_triggered_development_delivery|[Manually](#triggering-a-delivery-using-the-ci)|:heavy_check_mark:|:heavy_check_mark:|:x:|Development|
|api_triggered_production_delivery|[Manually](#triggering-a-delivery-using-the-ci)|:heavy_check_mark:|:heavy_check_mark:|:heavy_check_mark:|Production|

Steps executed if *Checks* is checked :heavy_check_mark::
* Linting
* Flow type checking
* Unit testing with jest
* Building the app

Steps executed if *Bump version* is checked :heavy_check_mark::
* Jira releases
* Move release notes
* Bump version: Bump the version(s) and create a tag and release on github

Versions built if *Builds* is checked :heavy_check_mark::
* Production integreat build
* Production malte build
* Development integreat-test-cms build

## Determining the Next Version

The next version of the app must be determined programmatically. The tool [next-version](../tools/next-version) can be used.
More information on the version naming schema used can be found [here](01-conventions.md#versioning).

## Services

### deliverino (GitHub)

`deliverino` is a GitHub App and can be accessed and installed [here](https://github.com/apps/deliverino). This bot bumps the version of the app when a new release is delivered.
A private key in PEM format grants access to the bot. If the `deliverino` is installed for a specific repository then it has access to create commits there.

**`deliverino` has the role of an Administrator. This is important when setting up ["Protected branches"](https://help.github.com/en/github/administering-a-repository/about-branch-restrictions) in GitHub. You have to disable "Include Administrators", else `deliverino` is not allowed to directly commit to the protected branch.**

### deliverino (Slack)

The Slack bot `deliverino` is responsible to notify Slack channels about releases. It posts a message for iOS and Android individually as soon as the delivery step has finished.

## Hints and Quirks

### CPU count aka. $TOTAL_CPUS

There is no obvious way for an application to know how many cores it has available in a CircleCI docker container. The usual ways of getting the CPU count reports the CPU count of the host. This causes out-of-memory issues as the host has a lot of cores.
Therefore, all tools must set the worker limit to `$TOTAL_CPUS`. Set this variable in the `.circleci/config.yml`.
