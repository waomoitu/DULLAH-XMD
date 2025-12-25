// lib/autoreply.js
const Config = require('../config/set'); // make sure path is correct

const handleAutoReply = async (zk, msg, from, text) => {
  if (Config.AUTO_REPLY !== 'yes') return;

  const replies = {
    "hi": "*Yes, my friend DULLAH XMD 🔥 is here 👑❤️*",
    "hello": "*Yes, my friend DULLAH XMD 🔥 is here 👑❤️*",
    "good morning": "*Good Morning 🌅*",
    "good night": "*Good Night..🌉*",
    "bye": "*Bye bye....*",
    "assalam-o-alaikum": "> *Walaikum Assalam ❤‍🔥🤌🏻*",
    ".xmd": "*DULLAH XMD 🔥༽༼ 🫀*",
    "link": "*Raha Nhai Jata 🌚🙌😂*",
    "dullah": "*Yes, my friend DULLAH XMD 🔥 is here 👑❤️*",
    "dafa": "*dfm.😣*",
    ".sup": "*DULLAH XMD 🔥༽༼ 🫀*",
    "hmm": "> *Hmm.🌚*", 
    "lanat": "*Lakhhhhhhhhhh Di Lanat 🙌😂*",
    "uff": "*💋 Hey*",
    "love": "*Love you too 💗😁*"
  };

  const key = text.toLowerCase().trim();

  if (replies[key]) {
    await zk.sendMessage(from, { text: replies[key] }, { quoted: msg });
  }
};

module.exports = { handleAutoReply };
