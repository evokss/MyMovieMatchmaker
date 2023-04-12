const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;

const server = http.createServer(function (req, res) {
  console.log(`${req.method} request for ${req.url}`);

  if (req.url === '/') {
    const indexPath = path.join(__dirname, 'index.html');
    const html = fs.readFileSync(indexPath, 'utf8');
    res.setHeader('Content-type', 'text/html');
    res.writeHead(200);
    res.end(html);
  } else {
    res.writeHead(404, {'Content-type': 'text/plain'});
    res.end('Page not found');
  }
});

server.listen(port, function () {
  console.log(`Server is listening on port ${port}`);
});