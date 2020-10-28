# Delivery

## Environments

### Production

* integreat.app
* malteapp.de

### Development

* webnext.integreat.app
* webnext.malteapp.de

## Automatic delivery

### Production

Every two weeks an automatic delivery to the production environments is made.
See the [workflow section](../../docs/cicd.md#workflows) for more information.

### Development

Every commit to the *main* branch triggers a delivery to the development environments.
See the [workflow section](../../docs/cicd.md#workflows) for more information.

## Manually trigger a delivery

If the automatic deliveries are not sufficient and you want to trigger a manual delivery,
you can trigger a delivery as described [here](../../docs/cicd.md#triggering-a-delivery-using-the-ci).
