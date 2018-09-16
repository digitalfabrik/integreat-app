const http = require('http')
const httpProxy = require('http-proxy')

const METRO_PORT = 8081

const proxy = httpProxy.createProxyServer({
  target: {
    host: 'max-arch',
    port: 8081
  }
})

const proxyServer = http.createServer(function (req, res) {
  proxy.web(req, res)
})

//
// Listen to the `upgrade` event and proxy the
// WebSocket requests as well.
//
proxyServer.on('upgrade', function (req, socket, head) {
  proxy.ws(req, socket, head)
})

console.log('Starting proxy server...')
proxyServer.listen(METRO_PORT)
console.log('Proxy server started')
