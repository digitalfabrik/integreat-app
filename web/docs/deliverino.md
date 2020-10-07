# deliverino (GitHub)

`deliverino` is a GitHub App and can be accessed and installed [here](https://github.com/apps/deliverino). This bot bumps the version of the app when a new release is delivered.
A private key in PEM format grants access to the bot. If the `deliverino` is installed for a specific repository then it has access to create commits there.

**`deliverino` has the role of an Administrator. This is important when setting up ["Protected branches"](https://help.github.com/en/github/administering-a-repository/about-branch-restrictions) in GitHub. You have to disable "Include Administrators", else `deliverino` is not allowed to directly commit to the protected branch.**

## deliverino (Slack)

The Slack bot `deliverino` is responsible to notify Slack channels about releases. It posts a message for iOS and Android individually as soon as the delivery step has finished.
