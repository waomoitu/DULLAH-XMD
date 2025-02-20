const axios = require('axios');
const { zokou } = require('../framework/zokou');


// Helper function to fetch data from API
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("API Fetch Error:", error);
    return null;
  }
}

// Fetch latest forex news
zokou({
  nomCom: "forex1",
  reaction: "📈",
  category: "forex",
  desc: "Fetches the latest forex news"
}, async (dest, zk, commandeOptions) => {
  const { repondre } = commandeOptions;
  
  const apiUrl = `https://api.polygon.io/v2/reference/news?apiKey=${process.env.POLYGON_API_KEY}`;
  const data = await fetchData(apiUrl);

  if (!data || !data.results || data.results.length === 0) {
    return zk.reply(dest, "*No forex news available at the moment.*");
  }

  let output = "*Latest Forex News:*\n\n";
  data.results.slice(0, 5).forEach((article, index) => {
    output += `📌 *Title:* ${article.title}\n`;
    output += `📰 *Publisher:* ${article.publisher?.name || "Unknown"}\n`;
    output += `📅 *Published:* ${article.published_utc}\n`;
    output += `🔗 [Read More](${article.article_url})\n\n`;
    if (index < 4) output += "---\n\n";
  });

  return zk.reply(dest, output);
});

// Fetch forex market status
zokou({
  nomCom: "fxstatus",
  category: "forex",
  desc: "Fetches the current status of the forex market"
}, async (dest, zk, commandeOptions) => {
  const apiUrl = `https://api.polygon.io/v1/marketstatus/now?apiKey=${process.env.POLYGON_API_KEY}`;
  const data = await fetchData(apiUrl);

  if (!data) return zk.reply(dest, "*Failed to fetch forex market status.*");

  let output = `📉 *Forex Market Status:*\n`;
  output += `🟢 Market: ${data.market ? "Open" : "Closed"}\n`;
  output += `🌙 After Hours: ${data.afterHours ? "Closed" : "Open"}\n\n`;
  output += `💱 *Currencies:*\nCrypto: ${data.currencies?.crypto || "Unknown"}\nFX: ${data.currencies?.fx || "Unknown"}\n\n`;
  output += `🏦 *Exchanges:*\nNASDAQ: ${data.exchanges?.nasdaq || "Unknown"}\nNYSE: ${data.exchanges?.nyse || "Unknown"}\nOTC: ${data.exchanges?.otc || "Unknown"}\n\n`;
  output += `⏳ *Server Time:* ${data.serverTime || "N/A"}`;

  return zk.reply(dest, output);
});

// Fetch active forex currency pairs
zokou({
  nomCom: "fxpairs"
  category: "forex",
  desc: "Fetches a list of active forex currency pairs"
}, async (dest, zk, commandeOptions) => {
  const apiUrl = `https://api.polygon.io/v3/reference/tickers?market=fx&active=true&apiKey=${process.env.POLYGON_API_KEY}`;
  const data = await fetchData(apiUrl);

  if (!data || !data.results || data.results.length === 0) {
    return zk.reply(dest, "*No active forex currency pairs found.*");
  }

  let output = "*💱 Active Forex Currency Pairs:*\n\n";
  data.results.slice(0, 10).forEach(pair => output += `🔹 ${pair.ticker}: ${pair.name}\n`);

  return zk.reply(dest, output);
});

// Fetch forex exchange rates
zokou({
  nomCom: "fxexchange",
  category: "forex",
  desc: "Fetches the latest foreign exchange rates against the US Dollar",
  usage: "fxexchange [currency_code]"
}, async (dest, zk, commandeOptions) => {
  const args = commandeOptions.args || [];
  const currencyCode = (args[0] || "USD").toUpperCase();
  const apiUrl = `https://api.exchangerate-api.com/v4/latest/${currencyCode}`;
  const data = await fetchData(apiUrl);

  if (!data || !data.rates) {
    return zk.reply(dest, `*Failed to fetch exchange rates for ${currencyCode}.*`);
  }

  let output = `💰 *Foreign Exchange Rates (${data.base}):*\n\n`;
  let count = 0;
  for (const [currency, rate] of Object.entries(data.rates)) {
    output += `🔸 ${currency}: ${rate.toFixed(4)}\n`;
    if (++count >= 10) break; // Limit response to 10 currencies
  }

  return zk.reply(dest, output);
});

// Fetch active stock tickers
zokou({
  nomCom: "stocktickers",
  category: "stocks",
  desc: "Fetches a list of active stock tickers",
  usage: "stocktickers [limit]"
}, async (dest, zk, commandeOptions) => {
  const args = commandeOptions.args || [];
  const limit = Math.min(parseInt(args[0]) || 10, 50); // Limit between 1 and 50
  const apiUrl = `https://api.polygon.io/v3/reference/tickers?active=true&limit=${limit}&apiKey=${process.env.POLYGON_API_KEY}`;
  const data = await fetchData(apiUrl);

  if (!data || !data.results || data.results.length === 0) {
    return zk.reply(dest, "*No active stock tickers found.*");
  }

  let output = `📊 *Active Stock Tickers (Limit: ${limit}):*\n\n`;
  data.results.forEach(ticker => output += `🔹 ${ticker.ticker}: ${ticker.name}\n`);

  return zk.reply(dest, output);
});
