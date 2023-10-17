const morgan = require('morgan');
const express = require('express');
const axios = require('axios');

const port = 8080;

const app = express();

app.set('port', process.env.PORT || port);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.redirect('/airkorea');
});

app.get('/airkorea', async (req, res) => {
    const serviceKey = "TmliNLK%2BMxHxuin3oikNVclqhEMV%2BwYSce6XvcF5Jz%2BMPfH1UiAxjvnvnG56AC7nYzCv3AvfL%2FENAgEV1wHOxw%3D%3D";
    const airUrl = "http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty";

    let params = encodeURI('serviceKey') + '=' + serviceKey;
    params += '&' + encodeURI('numOfRows') + '=' + encodeURI('1');
    params += '&' + encodeURI('pageNo') + '=' + encodeURI('1');
    params += '&' + encodeURI('dataTerm') + '=' + encodeURI('DAILY');
    params += '&' + encodeURI('ver') + '=' + encodeURI('1.3');
    params += '&' + encodeURI('stationName') + '=' + encodeURI('강남구');
    params += '&' + encodeURI('returnType') + '=' + encodeURI('json');

    const airApiUrl = airUrl + '?' + params;

    try{
        const result = await axios.get(airApiUrl);
        res.json(result.data);
    }
    catch(error){
        console.error(error);
    }
});

app.listen(app.get('port'), () => {
    console.log('Express server listening on port ' + app.get('port'));
});