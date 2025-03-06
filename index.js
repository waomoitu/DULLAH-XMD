'use strict';

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const baseUrl = 'https://raw.githubusercontent.com/boitech/dullah-editing-/refs/heads/main/commandes/';
const commandsFolder = path.join(__dirname, 'commands'); // Folder for commands
const commandsFile = path.join(commandsFolder, 'commands.js'); // Path for combined file

const scriptNames = [
    'AI.js', 'AI2.js', 'GPT.js', 'General.js', 'GroupQuotes.js', 'Lt.js', 'Media_dl.js', 'Mods.js', 'Nokia.js',
    'accapitalgm.js', 'afk.js', 'ahack.js', 'alive.js', 'anime.js', 'ans.js', 'anti-delete.js', 'anti-spam.js',
    'anti-sticker.js', 'antifake.js', 'apk.js', 'audioedit.js', 'bible.js', 'bine.js', 'blocklist.js', 'boom.js',
    'bug.js', 'canvascord.js', 'cat.js', 'chanel.js', 'chatbot.js', 'chatpt.js', 'codetest.js', 'conversation.js',
    'cricket.js', 'delnote.js', 'deobfuscate.js', 'deploy.js', 'design.js', 'dog.js', 'dullah.js', 'dullaht.js',
    'elod.js', 'events.js', 'events2.js', 'fancy.js', 'forward.js', 'fpp.js', 'frnews.js', 'fresavecontact.js',
    'friends.js', 'games.js', 'getall.js', 'groupe.js', 'grp-set.js', 'guy.js', 'helper.js', 'hentai.js',
    'hentai2.js', 'humidity.js', 'igdl-fb-tk.js', 'img.js', 'lama.js', 'logo.js', 'tyf.js', 'math.js', 'menu.js',
    'metal.js', 'mont.js', 'movie.js', 'oogs.js', 'other.js', 'owner1.js', 'pair2.js', 'parole.js', 'pastebin.js',
    'pay.js', 'play.js', 'plot.js', 'ponp.js', 'profile.js', 'proprio.js', 'prx.js', 'quote.js', 'reaction.js',
    'rpt.js', 'sc.js', 'scan.js', 'set.js', 'solar.js', 'stickcmd.js', 'stickersearch.js', 'style.js', 'swidth.js',
    'system.js', 'team.js', 'test.js', 'trt.js', 'tts.js', 'ttt.js', 'twi.js', 'uptime.js', 'vars.js', 'vc_files.js',
    'voir.js', 'voit.js', 'wallpaper.js', 'warn.js', 'weather.js', 'weeb.js', 'wees.js', 'whois.js', 'youtube.js',
    'zgpt.js'
];

// Ensure the commands folder exists
if (!fs.existsSync(commandsFolder)) {
    fs.mkdirSync(commandsFolder, { recursive: true });
}

async function fetchCommands() {
    let commandsContent = `"use strict";\n\n// All fetched commands combined here\n\n`;

    for (const scriptName of scriptNames) {
        try {
            const scriptUrl = `${baseUrl}${scriptName}`;
            console.log(`Fetching: ${scriptUrl}`);

            const response = await axios.get(scriptUrl);
            commandsContent += `\n// --- ${scriptName} ---\n` + response.data + '\n';
        } catch (error) {
            console.error(`Error fetching ${scriptName}:`, error.message);
        }
    }

    // Save all scripts in commands/commands.js
    fs.writeFileSync(commandsFile, commandsContent, 'utf-8');
    console.log('✅ All commands saved in commands/commands.js');
}

// Function to load commands.js after fetching
async function loadCommands() {
    await fetchCommands();

    try {
        require('./dullah/xmd.js'); // Load all commands from the folder
        console.log('✅ All commands loaded successfully!');
    } catch (error) {
        console.error('❌ Error loading commands:', error.message);
    }
}

// Start process
loadCommands();
