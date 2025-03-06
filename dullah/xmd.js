'use strict';

const axios = require('axios');
const cheerio = require('cheerio'); 
const path = require('path');
const fs = require('fs');

const webPageUrl = 'https://dullah-xmd-commands-phi.vercel.app';

// List of script filenames
const scriptNames = [
    'AI.js', 'AI2.js', 'GPT.js', 'General.js', 'GroupQuotes.js', 'Lt.js', 'Media_dl.js', 'Mods.js', 'Nokia.js',
    'accapitalgm.js', 'afk.js', 'ahack.js', 'alive.js', 'anime.js', 'ans.js', 'anti-delete.js', 'anti-spam.js', 
    'anti-sticker.js', 'antifake.js', 'apk.js', 'audioedit.js', 'bible.js', 'bine.js', 'blocklist.js', 'boom.js', 
    'bug.js', 'canvascord.js', 'cat.js', 'chanel.js', 'chatbot.js', 'chatpt.js', 'codetest.js', 'conversation.js', 
    'cricket.js', 'delnote.js', 'deobfuscate.js', 'deploy.js', 'design.js', 'dog.js', 'dullah.js', 'dullaht.js', 
    'elod.js', 'events.js', 'events2.js', 'fancy.js', 'forward.js', 'fpp.js', 'frnews.js', 'fresavecontact.js', 
    'friends.js', 'games.js', 'getall.js', 'groupe.js', 'grp-set.js', 'guy.js', 'helper.js', 'hentai.js', 'hentai2.js', 
    'humidity.js', 'igdl-fb-tk.js', 'img.js', 'lama.js', 'logo.js', 'tyf.js', 'math.js', 'menu.js', 'metal.js', 
    'mont.js', 'movie.js', 'oogs.js', 'other.js', 'owner1.js', 'pair2.js', 'parole.js', 'pastebin.js', 'pay.js', 
    'play.js', 'plot.js', 'ponp.js', 'profile.js', 'proprio.js', 'prx.js', 'quote.js', 'reaction.js', 'rpt.js', 
    'sc.js', 'scan.js', 'set.js', 'solar.js', 'stickcmd.js', 'stickersearch.js', 'style.js', 'swidth.js', 'system.js', 
    'team.js', 'test.js', 'trt.js', 'tts.js', 'ttt.js', 'twi.js', 'uptime.js', 'vars.js', 'vc_files.js', 'voir.js', 
    'voit.js', 'wallpaper.js', 'warn.js', 'weather.js', 'weeb.js', 'wees.js', 'whois.js', 'youtube.js', 'zgpt.js'
];

// Folder to store scripts
const commandsFolder = path.join(__dirname, 'commands');
if (!fs.existsSync(commandsFolder)) fs.mkdirSync(commandsFolder, { recursive: true });

// Function to fetch and save scripts
async function fetchAndSaveScript(scriptName) {
    try {
        const scriptUrl = `${webPageUrl.replace(/\/$/, '')}/${scriptName}`; // ✅ FIXED
        console.log(`🌍 Fetching: ${scriptUrl}`);

        const scriptResponse = await axios.get(scriptUrl);
        const scriptFilePath = path.join(commandsFolder, scriptName);
        fs.writeFileSync(scriptFilePath, scriptResponse.data, 'utf8');

        console.log(`✅ Saved: ${scriptName}`);
    } catch (error) {
        console.error(`❌ Error fetching ${scriptName}:`, error.message);
    }
}

// Fetch all scripts
async function fetchAllScripts() {
    console.log('🚀 Fetching all commands from the web...');
    for (const scriptName of scriptNames) await fetchAndSaveScript(scriptName);
    console.log('🎉 All scripts fetched and saved successfully!');
}

// Execute
fetchAllScripts();
