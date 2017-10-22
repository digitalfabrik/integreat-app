# Tools to deploy the webapp in the integreat environment

## Scripts
* start-vpn-proxy - starts a local socks proxy you can use to tunnel your ssh connection
* ssh-deploy.sh - copies the files to the remote server

## SSH config
Replace host with the remote ssh host and user with our ssh user name.

```
Host HOST
  User USER
  ProxyCommand nc -X 5 -x 127.0.0.1:9052 %h %p
```

_**Warning:** netcat-bsd and ocproxy is needed_
