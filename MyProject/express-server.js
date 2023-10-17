const express = require('express');
const app = express();
const port = 8080;
const routerA = express.Router();
const routerB = express.Router();

//------------------get method------------------
routerA.get('/index/:id', function(req, res) {
    res.send('Hello WorldA! ' + req.params.id);
});

routerB.get('/index/:id', function(req, res) {
    res.send('Hello WorldB! ' + req.params.id);
});

//------------------use method------------------
app.use('/a', routerA);
app.use('/b', routerB);

//-----------------------------post method---------------------------
app.listen(port, () => console.log(`Example app listening on port ${port}!`));