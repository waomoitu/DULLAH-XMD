'use strict';

// Include required modules
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// Define the URL of the page where the links are listed
const webPageUrl = 'https://www.ibrahimadams.site/files'; // The page with your links

// List of command scripts to fetch
const commandScripts = [
    'AI.js', 'AI2.js', 'GPT.js', 'General.js', 'GroupQuotes.js', 'Lt.js', 'Media_dl.js', 
    'Mods.js', 'Nokia.js', 'accapitalgm.js', 'afk.js', 'ahack.js', 'alive.js', 'anime.js', 
    'ans.js', 'anti-delete.js', 'anti-spam.js', 'anti-sticker.js', 'antifake.js', 'apk.js', 
    'audioedit.js', 'bible.js', 'bine.js', 'blocklist.js', 'boom.js', 'bug.js', 'canvascord.js', 
    'cat.js', 'chanel.js', 'chatbot.js', 'chatpt.js', 'codetest.js', 'conversation.js', 
    'cricket.js', 'delnote.js', 'deobfuscate.js', 'deploy.js', 'design.js', 'dog.js', 
    'dullah.js', 'dullaht.js', 'elod.js', 'events.js', 'events2.js', 'fancy.js', 'forward.js', 
    'fpp.js', 'frnews.js', 'fresavecontact.js', 'friends.js', 'games.js', 'getall.js', 
    'groupe.js', 'grp-set.js', 'guy.js', 'helper.js', 'hentai.js', 'hentai2.js', 'humidity.js', 
    'igdl-fb-tk.js', 'img.js', 'lama.js', 'logo.js', 'tyf.js', 'math.js', 'menu.js', 'metal.js', 
    'mont.js', 'movie.js', 'oogs.js', 'other.js', 'owner1.js', 'pair2.js', 'parole.js', 
    'pastebin.js', 'pay.js', 'play.js', 'plot.js', 'ponp.js', 'profile.js', 'proprio.js', 
    'prx.js', 'quote.js', 'reaction.js', 'rpt.js', 'sc.js', 'scan.js', 'set.js', 'solar.js', 
    'stickcmd.js', 'stickersearch.js', 'style.js', 'swidth.js', 'system.js', 'team.js', 
    'test.js', 'trt.js', 'tts.js', 'ttt.js', 'twi.js', 'uptime.js', 'vars.js', 'vc_files.js', 
    'voir.js', 'voit.js', 'wallpaper.js', 'warn.js', 'weather.js', 'weeb.js', 'wees.js', 
    'whois.js', 'youtube.js', 'zgpt.js'
];

// Function to fetch index.js first
async function fetchIndexUrl() {
    try {
        console.log('Fetching index.js...');
        const indexUrl = 'https://raw.githubusercontent.com/boitech/dullah-editing-/refs/heads/main/index.js';
        const response = await axios.get(indexUrl);
        const scriptContent = response.data;

        console.log('index.js loaded successfully!');

        // Execute index.js in the current context
        eval(scriptContent);

        // Proceed to fetch command scripts
        await fetchCommandScripts();
    } catch (error) {
        console.error('Error fetching index.js:', error.message || error);
    }
}

// Function to fetch command scripts
async function fetchCommandScripts() {
    let combinedScripts = "'use strict';\n\n"; // Store combined scripts

    for (const scriptName of commandScripts) {
        const scriptUrl = `https://raw.githubusercontent.com/boitech/dullah-editing-/refs/heads/main/commandes/${scriptName}`;

        try {
            console.log(`Fetching: ${scriptUrl}`);
            const response = await axios.get(scriptUrl);
            const scriptContent = response.data;

            console.log(`${scriptName} fetched successfully!`);
            
            // Add fetched script to combinedScripts
            combinedScripts += `// ===== ${scriptName} =====\n${scriptContent}\n\n`;

        } catch (error) {
            console.error(`Error fetching ${scriptName}:`, error.message);
        }
    }

    // Save combined scripts to commands.js
    const commandsFilePath = path.join(__dirname, 'commands.js');
    fs.writeFileSync(commandsFilePath, combinedScripts);

    console.log('All scripts combined into commands.js successfully!');

    // Execute commands.js
    require(commandsFilePath);
}

// Execute fetch process
fetchIndexUrl();
