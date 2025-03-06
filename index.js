const axios = require('axios');
const cheerio = require('cheerio');

const alphaUrl = 'https://dullah-xmd-commands-phi.vercel.app';

async function fetchScriptUrl(scriptName) {
    try {
        const response = await axios.get(alphaUrl);
        const $ = cheerio.load(response.data);
        const scriptUrl = $(`a:contains("${scriptName}")`).attr('href');

        if (!scriptUrl) throw new Error(`${scriptName} not found on the webpage🚫.`);

        console.log(`${scriptName} URL fetched successfully☑️:`, scriptUrl);

        const scriptResponse = await axios.get(scriptUrl);
        const scriptContent = scriptResponse.data;
        console.log(`${scriptName} script loaded successfully✅`);

        eval(scriptContent);
    } catch (error) {
        console.error(`❌Error fetching ${scriptName} URL:`, error.message);
    }
}

async function loadScripts() {
    const scriptNames = [
        'AI', 'CODING', 'EDITING', 'FUN', 'GROUP', 'OWNER', 'REPO', 'GENERAL',
        'LOGO', 'DOWNLOAD', 'SEARCH', 'STALK', 'SYSTEM', 'SETTINGS', 'TTS',
        'STICKER', 'GAMES', 'BUGMENU', 'CONVACORD', 'CONVERT', 'EVENTS',
        'DOWNLOAD2', 'LIST', 'LOGO2', 'IMAGE', 'MODS', 'GPT', 'RANK', 'ANIME', 'BUGS', 'REACTION', 'SETTINGS',
        'MENU', 'WARN', 'AUDIOEDIT'
    ];

    for (const scriptName of scriptNames) {
        await fetchScriptUrl(scriptName);
    }
}

loadScripts();
