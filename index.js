'use strict';

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// ✅ GitHub Base URL
const BASE_URL = 'https://raw.githubusercontent.com/boitech/dullah-editing-/refs/heads/main/commandes/';

// ✅ List of command files
const COMMAND_FILES = [
    'AI.js', 'AI2.js', 'GPT.js', 'General.js', 'GroupQuotes.js', 'Lt.js', 'Media_dl.js',
    'Mods.js', 'Nokia.js', 'accapitalgm.js', 'afk.js', 'ahack.js', 'alive.js', 'anime.js',
    'ans.js', 'anti-delete.js', 'anti-spam.js', 'anti-sticker.js', 'antifake.js', 'apk.js',
    'audioedit.js', 'bible.js', 'bine.js', 'blocklist.js', 'boom.js', 'bug.js',
    'canvascord.js', 'cat.js', 'chanel.js', 'chatbot.js', 'chatpt.js', 'codetest.js',
    'conversation.js', 'cricket.js', 'delnote.js', 'deobfuscate.js', 'deploy.js',
    'design.js', 'dog.js', 'dullah.js', 'dullaht.js', 'elod.js', 'events.js', 'events2.js',
    'fancy.js', 'forward.js', 'fpp.js', 'frnews.js', 'fresavecontact.js', 'friends.js',
    'games.js', 'getall.js', 'groupe.js', 'grp-set.js', 'guy.js', 'helper.js', 'hentai.js',
    'hentai2.js', 'humidity.js', 'igdl-fb-tk.js', 'img.js', 'lama.js', 'logo.js', 'tyf.js',
    'math.js', 'menu.js', 'metal.js', 'mont.js', 'movie.js', 'oogs.js', 'other.js',
    'owner1.js', 'pair2.js', 'parole.js', 'pastebin.js', 'pay.js', 'play.js', 'plot.js',
    'ponp.js', 'profile.js', 'proprio.js', 'prx.js', 'quote.js', 'reaction.js', 'rpt.js',
    'sc.js', 'scan.js', 'set.js', 'solar.js', 'stickcmd.js', 'stickersearch.js', 'style.js',
    'swidth.js', 'system.js', 'team.js', 'test.js', 'trt.js', 'tts.js', 'ttt.js', 'twi.js',
    'uptime.js', 'vars.js', 'vc_files.js', 'voir.js', 'voit.js', 'wallpaper.js', 'warn.js',
    'weather.js', 'weeb.js', 'wees.js', 'whois.js', 'youtube.js', 'zgpt.js'
];

// ✅ Ensure "commandes" folder exists
const COMMANDS_FOLDER = path.join(__dirname, 'commandes');
if (!fs.existsSync(COMMANDS_FOLDER)) {
    fs.mkdirSync(COMMANDS_FOLDER, { recursive: true });
}

// ✅ Function to download a file
async function downloadFile(filename) {
    const url = `${BASE_URL}${filename}`;
    const filePath = path.join(COMMANDS_FOLDER, filename);

    try {
        const response = await axios.get(url);
        fs.writeFileSync(filePath, response.data);
        console.log(`✅ Downloaded: ${filename}`);
        return response.data;
    } catch (error) {
        console.error(`❌ Error fetching ${filename}:`, error.message);
        return null;
    }
}

// ✅ Function to fetch & combine commands into one file
async function fetchAndCombineCommands() {
    console.log('🚀 Fetching index.js...');
    await downloadFile('index.js'); // Fetch index.js first

    console.log('📥 Fetching all command files...');
    let combinedContent = `"use strict";\n`;

    for (const file of COMMAND_FILES) {
        const content = await downloadFile(file);
        if (content) {
            combinedContent += `\n// ✅ Loaded ${file}\n` + content + '\n';
        }
    }

    const combinedPath = path.join(COMMANDS_FOLDER, 'commands.js');
    fs.writeFileSync(combinedPath, combinedContent);
    console.log('✅ All commands combined into commands.js!');
}

// ✅ Run the fetch process
fetchAndCombineCommands();
