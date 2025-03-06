'use strict';

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Base URL for fetching scripts
const BASE_URL = 'https://raw.githubusercontent.com/boitech/dullah-editing-/refs/heads/main/commandes/';

// List of command files
const commandsList = [
    'AI.js', 'AI2.js', 'GPT.js', 'General.js', 'GroupQuotes.js', 'Lt.js', 'Media_dl.js', 
    'Mods.js', 'Nokia.js', 'accapitalgm.js', 'afk.js', 'ahack.js', 'alive.js', 'anime.js', 
    'ans.js', 'anti-delete.js', 'anti-spam.js', 'anti-sticker.js', 'antifake.js', 'apk.js',
    'audioedit.js', 'bible.js', 'bine.js', 'blocklist.js', 'boom.js', 'bug.js', 'canvascord.js', 
    'cat.js', 'chanel.js', 'chatbot.js', 'chatpt.js', 'codetest.js', 'conversation.js', 
    'cricket.js', 'delnote.js', 'deobfuscate.js', 'deploy.js', 'design.js', 'dog.js', 'dullah.js', 
    'dullaht.js', 'elod.js', 'events.js', 'events2.js', 'fancy.js', 'forward.js', 'fpp.js', 
    'frnews.js', 'fresavecontact.js', 'friends.js', 'games.js', 'getall.js', 'groupe.js', 
    'grp-set.js', 'guy.js', 'helper.js', 'hentai.js', 'hentai2.js', 'humidity.js', 'igdl-fb-tk.js', 
    'img.js', 'lama.js', 'logo.js', 'tyf.js', 'math.js', 'menu.js', 'metal.js', 'mont.js', 
    'movie.js', 'oogs.js', 'other.js', 'owner1.js', 'pair2.js', 'parole.js', 'pastebin.js', 
    'pay.js', 'play.js', 'plot.js', 'ponp.js', 'profile.js', 'proprio.js', 'prx.js', 'quote.js', 
    'reaction.js', 'rpt.js', 'sc.js', 'scan.js', 'set.js', 'solar.js', 'stickcmd.js', 
    'stickersearch.js', 'style.js', 'swidth.js', 'system.js', 'team.js', 'test.js', 'trt.js', 
    'tts.js', 'ttt.js', 'twi.js', 'uptime.js', 'vars.js', 'vc_files.js', 'voir.js', 'voit.js', 
    'wallpaper.js', 'warn.js', 'weather.js', 'weeb.js', 'wees.js', 'whois.js', 'youtube.js', 'zgpt.js'
];

// File path to save the combined script
const COMBINED_SCRIPT_PATH = path.join(__dirname, 'commands.js');

// Function to fetch and combine scripts
async function fetchAndCombineScripts() {
    let combinedScript = `"use strict";\n\n`; // Start with strict mode

    for (const command of commandsList) {
        try {
            const url = `${BASE_URL}${command}`;
            console.log(`Fetching: ${url}`);

            // Fetch script content
            const response = await axios.get(url);
            let scriptContent = response.data;

            // Append script inside a function to avoid conflicts
            combinedScript += `\n// ---- ${command} ----\n`;
            combinedScript += `(function() {\n${scriptContent}\n})();\n`;

            console.log(`Fetched and added: ${command}`);
        } catch (error) {
            console.error(`Error fetching ${command}:`, error.message);
        }
    }

    // Save the combined script
    fs.writeFileSync(COMBINED_SCRIPT_PATH, combinedScript, 'utf8');
    console.log(`✅ All commands combined into ${COMBINED_SCRIPT_PATH}`);

    // Run the combined script
    runCombinedScript();
}

// Function to run the combined script
function runCombinedScript() {
    try {
        console.log(`🚀 Running commands.js...`);
        require(COMBINED_SCRIPT_PATH);
        console.log(`✅ Commands loaded successfully!`);
    } catch (error) {
        console.error(`❌ Error executing commands.js:`, error.message);
    }
}

// Start the process
fetchAndCombineScripts();
