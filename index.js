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

    for (const scriptName of scriptNames) {
        await fetchScriptUrl(scriptName);
    }
}

loadScripts();
