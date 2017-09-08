const http = require('http');

const server = new http.Server();

server.listen(1337, '127.0.0.1');

server.on('request', function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
  res.end('Hello world');
});
