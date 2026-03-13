const axios = require("axios");

async function Telesticker(url) {

const packName = url.split("/addstickers/")[1];

const api = `https://api.telegram.org/bot/getStickerSet?name=${packName}`;

try {

const { data } = await axios.get(api);

if (!data.result || !data.result.stickers) return [];

const stickers = data.result.stickers.map(s => {
return {
url: `https://api.telegram.org/file/bot${data.result.stickers[0].file_id}`
};
});

return stickers;

}
catch(err){
console.log("Telesticker fetch error:",err);
return [];
}

}

module.exports = Telesticker;
