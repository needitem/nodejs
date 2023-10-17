const express = require('express');
const app = express();
const port = 8080;

app.use(express.static(__dirname + '/public'));
app.use(function(req, res, next) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<img src="/rint.png" width="100%"/>');
    next();
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

