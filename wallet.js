const { zokou } = require("../framework/zokou");
const eco = require("../lib/monay");

zokou({
  nomCom: "wallet",
  desc: "Shows your wallet and bank balance (accurate) with image.",
  categorie: "Economy",
  reaction: "💷"
}, async (dest, zk, commandeOptions) => {
  const { repondre, auteurMessage, nomAuteurMessage } = commandeOptions;

  try {
    // Get balance (do not auto-register)
    const balance = eco.getBalance
      ? eco.getBalance(auteurMessage, false)
      : (eco.getBalance // safety if exported differently
        ? eco.getBalance(auteurMessage, false)
        : { wallet: 0, bank: 0, bankCapacity: 100000 });

    // Build caption
    let msg = `*👛 ${nomAuteurMessage}'s Wallet:*\n\n` +
              `💰 Wallet: _🪙${balance.wallet}_\n` +
              `🏦 Bank: _🪙${balance.bank}_ / ${balance.bankCapacity}`;

    if (balance.wallet === 0 && balance.bank === 0) {
      msg += `\n\n_Your wallet and bank are empty. Earn coins to start using features._`;
    }

    // Send image first with caption
    await zk.sendMessage(dest, {
      image: { url: "https://files.catbox.moe/hj6q5m.jpeg" },
      caption: msg,
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363402252728845@newsletter",
          newsletterName: "Dullahxmd is Speed🔥",
          serverMessageId: -1
        }
      }
    });

  } catch (e) {
    console.error(e);
    repondre(`⚠️ Error fetching wallet info.\n\ncommand: wallet`);
  }
});