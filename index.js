const http = require('http');
const port = process.env.port || 3000;

const server = http.createServer(handle);

function handle(req, res) {
    res.write('Welcome to slughub!');
    res.end();
}

server.listen(port)