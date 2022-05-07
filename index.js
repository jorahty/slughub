const http = require('http');
const port = process.env.PORT || 3000;

const server = http.createServer(handle);

function handle(req, res) {
    res.write('Welcome to slughub! Default branch?');
    res.end();
}

server.listen(port)