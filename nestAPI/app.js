const morgan = require('morgan');
const express = require('express');

const app = express();

app.set('port', process.env.PORT || 3000);
app.use
(
    morgan('dev'),
    express.json(),
    express.urlencoded({extended: true})
);

let boardList = [];
let numOfBoards = 0;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/board', (req, res) => {
    res.json(boardList);
});

app.listen(app.get('port'), () => {
    console.log('Express server listening on port ' + app.get('port'));
});