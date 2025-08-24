const axios = require("axios");
const cheerio = require("cheerio");

async function textToLogoGenerator(style, ...texts) {
    try {
        // URL ya style
        let url = `https://textpro.me/${style}.html`;

        // Step 1: Fungua form page
        let { data } = await axios.get(url);
        const $ = cheerio.load(data);

        // Pata token ya CSRF
        let token = $('input[name="token"]').attr("value");
        if (!token) throw "Token not found!";

        // Step 2: Tuma data ya texts
        let payload = new URLSearchParams();
        for (let t of texts) {
            if (t) payload.append("text[]", t);
        }
        payload.append("submit", "Go");
        payload.append("token", token);

        let { data: postData } = await axios.post(url, payload, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });

        // Step 3: Parse result page kupata link ya image
        const $$ = cheerio.load(postData);
        let imageUrl = $$(".btn.btn-primary").attr("href");
        if (!imageUrl) throw "Image not found!";

        return imageUrl; // link ya picha
    } catch (e) {
        throw e;
    }
}

module.exports = { textToLogoGenerator };
