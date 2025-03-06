"use strict";

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const commandsBaseURL = 'https://dullah-xmd-commands-phi.vercel.app/'; // URL to fetch commands
const commandsFolder = path.join(__dirname, 'dullah'); // Folder where commands will be saved

// List of command files to fetch
const commandFiles = [
    'AI.js', 'GPT.js', 'General.js', 'Mods.js', 'Media_dl.js', 'Group.js', 'Owner.js',
    'Logo.js', 'Download.js', 'Search.js', 'Stalk.js', 'System.js', 'Settings.js', 
    'TTS.js', 'Sticker.js', 'Games.js', 'BugMenu.js', 'Convacord.js', 'Convert.js',
    'Events.js', 'Download2.js', 'List.js', 'Logo2.js', 'Image.js', 'Mods.js', 
    'Rank.js', 'Anime.js', 'Bugs.js', 'Reaction.js', 'Menu.js', 'Warn.js', 'AudioEdit.js'
];

// Ensure the `dullah` folder exists
if (!fs.existsSync(commandsFolder)) {
    fs.mkdirSync(commandsFolder, { recursive: true });
}

async function fetchAndSaveCommands() {
    for (const commandFile of commandFiles) {
        try {
            const commandURL = `${commandsBaseURL}${commandFile}`;
            console.log(`📥 Fetching: ${commandURL}`);

            const response = await axios.get(commandURL);
            const scriptContent = response.data;

            // Save each command as its own separate JS file in dullah/
            const commandPath = path.join(commandsFolder, commandFile);
            fs.writeFileSync(commandPath, scriptContent, 'utf-8');
            console.log(`✅ ${commandFile} saved in dullah/`);
        } catch (error) {
            console.error(`❌ Error fetching ${commandFile}:`, error.message);
        }
    }

    console.log(`✅ All commands have been fetched and saved!`);
}

// Function to load all commands dynamically
function loadCommands() {
    fs.readdirSync(commandsFolder).forEach((file) => {
        if (file.endsWith('.js')) {
            try {
                require(path.join(commandsFolder, file));
                console.log(`✅ Loaded: ${file}`);
            } catch (error) {
                console.error(`❌ Error loading ${file}:`, error.message);
            }
        }
    });
}

// Start fetching commands and then load them
fetchAndSaveCommands().then(() => {
    console.log(`🚀 Loading all commands...`);
    loadCommands();
});
