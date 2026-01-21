const fs = require('fs-extra');
const path = require('path');
const { Sequelize } = require('sequelize');

if (fs.existsSync(path.join(__dirname, 'set.env'))) {
    require('dotenv').config({ path: path.join(__dirname, 'set.env') });
}

const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL || databasePath;

const database =
    DATABASE_URL === databasePath
        ? new Sequelize({
              dialect: 'sqlite',
              storage: DATABASE_URL,
              logging: false,
          })
        : new Sequelize(DATABASE_URL, {
              dialect: 'postgres',
              ssl: true,
              protocol: 'postgres',
              dialectOptions: {
                  ssl: { require: true, rejectUnauthorized: false },
              },
              logging: false,
          });

const config = {
    session: process.env.SESSION_ID || '',
    PREFIXE: process.env.PREFIX || '.',
    OWNER_NAME: process.env.OWNER_NAME || 'DULLAH-MD',
    NUMERO_OWNER: process.env.NUMERO_OWNER || '255716945971',

    BOT_NAME: process.env.BOT_NAME || 'ᴅᴜʟʟᴀʜ-xᴍᴅ v²',
    URL: process.env.IMAGE_MENU || 'https://files.catbox.moe/3v4ezj.jpeg',

    MODE: process.env.PUBLIC_MODE || 'yes',
    PM_PERMIT: process.env.PM_PERMIT || 'yes',

    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || 'yes',
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',

    WARN_COUNT: process.env.WARN_COUNT || '3',
    ETAT: process.env.PRESENCE || '',
    CHATBOT: process.env.CHATBOT || 'no',
    DP: process.env.STARTING_BOT_MESSAGE || 'no',

    ADM: process.env.ANTI_DELETE_MESSAGE || 'yes',
    ANTIDELETE1: process.env.ANTIDELETE1 || 'no',
    ANTIDELETE2: process.env.ANTIDELETE2 || 'no',

    ANTISTATUSMENTION: process.env.ANTISTATUSMENTION || 'no',

    ANTICALL: process.env.ANTICALL || 'no',
    ANTIBAD: process.env.ANTIBAD || 'no',
    GROUP_ANTILINK: process.env.GROUP_ANTILINK || 'yes',

    AUTO_REACT: process.env.AUTO_REACT || 'no',
    AUTO_REACT_STATUS: process.env.AUTO_REACT_STATUS || 'yes',
    AUTO_REPLY: process.env.AUTO_REPLY || 'no',
    AUTO_READ: process.env.AUTO_READ || 'no',
    AUTO_SAVE_CONTACTS: process.env.AUTO_SAVE_CONTACTS || 'no',
    AUTO_REJECT_CALL: process.env.AUTO_REJECT_CALL || 'yes',
    AUTO_BIO: process.env.AUTO_BIO || 'yes',
    AUDIO_REPLY: process.env.AUDIO_REPLY || 'no',
    AUTO_TAG_STATUS: process.env.AUTO_TAG_STATUS || 'no',
    AUTO_STICKER: process.env.AUTO_STICKER || 'no',

    WELCOME_MESSAGE: process.env.WELCOME_MESSAGE || 'yes',
    GOODBYE_MESSAGE: process.env.GOODBYE_MESSAGE || 'yes',

    RMBG_KEY: process.env.RMBG_KEY || 'MLt7fM4Sqv63U9FAt6FdPKRL',

    DATABASE_URL,
    database,
};

const fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    delete require.cache[fichier];
    require(fichier);
});

module.exports = config;
