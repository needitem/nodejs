const morgan = require('morgan');
const express = require('express');
const request = require('request');

const port = 8080;

const app = express();

app.set('port', process.env.PORT || port);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.redirect('/naver/news');
});


app.get('/naver/news', (req, res) => {
    const client_id =  "ewSQX9zk_YZ5ktLaivuq";
    const client_secret = "8KqBuu5aDQ";

    const api_url = 'https://openapi.naver.com/v1/search/news.json?query=' + encodeURI('test');
    const option = {
    };
    const options = {
        url: api_url,
        qs: option,
        headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
    };

    req.get(options, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            let newsItems = JSON.parse(body).items;

            const newsJson = {
                titie: [],
                description: [],
                link: [],
                pubDate: []
            }
    
            for (let i = 0; i < newsItems.length; i++) {
                newsJson.titie.push(newsItems[i].title.replace(/<[^>]+>/g, ""));
                newsJson.description.push(newsItems[i].description.replace(/<[^>]+>/g, ""));
                newsJson.link.push(newsItems[i].link);
                newsJson.pubDate.push(newsItems[i].pubDate);
            }
            res.json(newsJson);
        } else {
            res.status(response.statusCode).end();
            console.log('error = ' + response.statusCode);
        }
    });
});


app.listen(app.get('port'), () => {
    console.log('Express server listening on port ' + app.get('port'));
});