const fetch = require("node-fetch");
const { zokou } = require("../framework/zokou");

zokou({
  nomCom: "forex1",
  category: "forex",
  desc: "Fetches the latest forex news"
}, async (message) => {
  try {
    const apiUrl = "https://api.polygon.io/v2/reference/news?apiKey=Y4iTYoJANwppB8I3Bm4QVWdV5oXlvc45";
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return message.reply("*No forex news available at the moment.*");
    }

    let output = "";
    data.results.forEach((article, index) => {
      output += `*Title:* ${article.title}\n`;
      output += `*Publisher:* ${article.publisher.name}\n`;
      output += `*Published UTC:* ${article.published_utc}\n`;
      output += `*Article URL:* ${article.article_url}\n\n`;
      if (index < data.results.length - 1) output += "---\n\n";
    });

    return message.reply(output);
  } catch (error) {
    console.error(error);
    return message.reply("*Failed to fetch forex news.*");
  }
});

zokou({
  name: "fxstatus",
  category: "forex",
  desc: "Fetches the current status of the forex market"
}, async (message) => {
  try {
    const apiUrl = "https://api.polygon.io/v1/marketstatus/now?apiKey=Y4iTYoJANwppB8I3Bm4QVWdV5oXlvc45";
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data) return message.reply("*Failed to fetch forex market status.*");

    let output = `*Forex Market Status:*\nAfter Hours: ${data.afterHours ? "Closed" : "Open"}\nMarket: ${data.market ? "Open" : "Closed"}\n\n*Currencies:*\nCrypto: ${data.currencies.crypto}\nFX: ${data.currencies.fx}\n\n*Exchanges:*\nNASDAQ: ${data.exchanges.nasdaq}\nNYSE: ${data.exchanges.nyse}\nOTC: ${data.exchanges.otc}\n\n*Server Time:* ${data.serverTime}`;

    return message.reply(output);
  } catch (error) {
    console.error(error);
    return message.reply("*Failed to fetch forex market status.*");
  }
});

zokou({
  name: "fxpairs",
  category: "forex",
  desc: "Fetches a list of active forex currency pairs"
}, async (message) => {
  try {
    const apiUrl = "https://api.polygon.io/v3/reference/tickers?market=fx&active=true&apiKey=Y4iTYoJANwppB8I3Bm4QVWdV5oXlvc45";
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data || !data.results || data.results.length === 0) {
      return message.reply("*Failed to fetch forex currency pairs.*");
    }

    let output = "*Active Forex Currency Pairs:*\n\n";
    data.results.forEach(pair => output += `${pair.ticker}: ${pair.name}\n`);

    return message.reply(output);
  } catch (error) {
    console.error(error);
    return message.reply("*Failed to fetch forex currency pairs.*");
  }
});

zokou({
  name: "fxexchange",
  category: "forex",
  desc: "Fetches the latest foreign exchange rates against the US Dollar",
  usage: "fxexchange [currency_code]"
}, async (message, args) => {
  try {
    const currencyCode = args[0] || "USD";
    const apiUrl = `https://api.exchangerate-api.com/v4/latest/${currencyCode}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data || !data.rates) {
      return message.reply(`*Failed to fetch exchange rates for ${currencyCode}.*`);
    }

    let output = `*Foreign Exchange Rates (${data.base})*\n\n`;
    for (const [currency, rate] of Object.entries(data.rates)) {
      output += `${currency}: ${rate.toFixed(4)}\n`;
    }

    return message.reply(output);
  } catch (error) {
    console.error(error);
    return message.reply("*Failed to fetch exchange rates.*");
  }
});

zokou({
  name: "stocktickers",
  category: "forex",
  desc: "Fetches a list of active stock tickers",
  usage: "stocktickers [limit]"
}, async (message, args) => {
  try {
    const limit = args[0] || 100;
    const apiUrl = `https://api.polygon.io/v3/reference/tickers?active=true&limit=${limit}&apiKey=Y4iTYoJANwppB8I3Bm4QVWdV5oXlvc45`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data || !data.results || data.results.length === 0) {
      return message.reply("*No active stock tickers found.*");
    }

    let output = `*Active Stock Tickers (Limit: ${limit}):*\n\n`;
    data.results.forEach(ticker => output += `${ticker.ticker}: ${ticker.name}\n`);

    return message.reply(output);
  } catch (error) {
    console.error(error);
    return message.reply("*Failed to fetch stock tickers.*");
  }
});
