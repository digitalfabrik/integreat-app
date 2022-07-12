# Delivery and Environments

## Contents

- [Production](#production)
- [Beta](#beta)
- [Development](#development)
- [Automatic Deliveries](../../docs/cicd.md#workflows)
- [Manual Delivery](../../docs/cicd.md#triggering-a-delivery-using-the-ci)

## Production

The actual web apps for our users. It contains the tested state from last weeks [beta environments](#beta):
- https://integreat.app
- https://malteapp.de
- https://aschaffenburg.app

## Beta

Every week an automatic delivery to the beta environments is made:
- https://beta.integreat.app
- https://beta.malteapp.de
- https://beta.aschaffenburg.app

## Development

Always contains the current state of the `main` branch and uses the test cms:

Urls:
- https://webnext.integreat.app
- https://webnext.malteapp.de
- https://webnext.aschaffenburg.app
