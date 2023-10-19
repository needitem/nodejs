const cheerio = require('cheerio');
const axios = require('axios');
const express = require('express');
const app = express();
const morgan = require('morgan');
const { get } = require('jquery');

const getHtml = async() => {
    try {
        return await axios.get("https://www.naver.com");
    } catch (error) {
        console.error(error);
    }
}

getHtml()
    .then(html => {
        let ulList = [];
        const $ = cheerio.load(html.data);
        const $bodyList = $("div.ah_roll_area > ul.ah_l > li.ah_item");

        $bodyList.each(function(i, elem) {
            ulList[i] = {
                rank: $(this).find('span.ah_r').text(),
                keyword: $(this).find('span.ah_k').text(),
                url: $(this).find('a').attr('href')
            };
        });

        const data = ulList.filter(n => n.rank);
        return data;
    })