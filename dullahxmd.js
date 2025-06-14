'use strict';

const axios = require('axios');
const express = require('express');

// Start Express server (for Heroku port binding)
const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('✅ DULLAH XMD Bot is running on Heroku.');
});

app.listen(PORT, () => {
  console.log(`🌐 Express server running on port ${PORT}`);
});

// Your dynamic script loader
const scriptName = 'index.js';
const scriptUrl = `https://dullah-xmd-commands-phi.vercel.app/${scriptName}`;

async function loadScript() {
    try {
        const response = await axios.get(scriptUrl);
        const scriptContent = response.data;

        console.log(`✅ ${scriptName} fetched and loaded successfully!`);
        eval(scriptContent);
    } catch (error) {
        console.error(`❌ Error loading ${scriptName}:`, error.message);
    }
}

loadScript();
