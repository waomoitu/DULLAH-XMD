const axios = require('axios');
const cheerio = require('cheerio');

const headers = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'Referer': 'https://mollygram.com/',
  'Origin': 'https://mollygram.com',
  'Accept': 'application/json, text/plain, */*'
};

async function fetchContent(username, method) {
  try {
    username = String(username || '').trim().replace(/^@/, '');

    if (!username) {
      return { total: 0, items: [], error: 'Username is required' };
    }

    const response = await axios.get(
      'https://media.mollygram.com/',
      {
        params: {
          url: username,
          method: method
        },
        headers,
        timeout: 30000,
        maxRedirects: 5
      }
    );

    const data = response.data;

    console.log(
      '[MOLLYGRAM] HTTP:',
      response.status,
      'Username:',
      username,
      'Method:',
      method
    );

    if (typeof data === 'string') {
      console.log('[MOLLYGRAM] TEXT RESPONSE:', data.slice(0, 1500));
    } else {
      console.log(
        '[MOLLYGRAM] JSON RESPONSE:',
        JSON.stringify(data).slice(0, 2500)
      );
    }

    let html = '';

    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        html = parsed.html || '';
      } catch {
        html = data;
      }
    } else if (data && typeof data === 'object') {
      if (data.status && data.status !== 'ok') {
        console.log('[MOLLYGRAM] API STATUS:', data.status);
      }

      html = data.html || data.data?.html || '';
    }

    if (!html) {
      console.log('[MOLLYGRAM] No HTML returned by the service.');
      return { total: 0, items: [], error: 'No HTML returned by Mollygram' };
    }

    const $ = cheerio.load(html);
    const items = [];
    const seen = new Set();

    const addItem = (type, url) => {
      if (!url) return;

      url = url.trim();

      if (url.startsWith('//')) {
        url = 'https:' + url;
      } else if (url.startsWith('/')) {
        url = 'https://media.mollygram.com' + url;
      }

      if (!/^https?:\/\//i.test(url) || seen.has(url)) return;

      seen.add(url);
      items.push({ type, url });
    };

    $('.load').each((_, el) => {
      const video =
        $(el).find('video source').attr('src') ||
        $(el).find('video').attr('src');

      const image =
        $(el).find('img').attr('src') ||
        $(el).find('img').attr('data-src');

      if (video) {
        addItem('video', video);
      } else if (image) {
        addItem('image', image);
      }
    });

    // Fallback: inspect all media elements if .load is absent.
    if (!items.length) {
      $('video').each((_, el) => {
        const url =
          $(el).find('source').attr('src') ||
          $(el).attr('src');

        addItem('video', url);
      });

      $('img').each((_, el) => {
        const url =
          $(el).attr('src') ||
          $(el).attr('data-src');

        addItem('image', url);
      });
    }

    console.log(
      `[MOLLYGRAM] Found ${items.length} media item(s) for @${username}`
    );

    return {
      total: items.length,
      items,
      error: items.length ? null : 'No media elements found in returned HTML'
    };
  } catch (error) {
    console.error(
      '[INSTAGRAM FETCH ERROR]',
      error.response?.status || '',
      error.message
    );

    if (error.response?.data) {
      console.error(
        '[INSTAGRAM ERROR RESPONSE]',
        String(
          typeof error.response.data === 'string'
            ? error.response.data
            : JSON.stringify(error.response.data)
        ).slice(0, 1500)
      );
    }

    return {
      total: 0,
      items: [],
      error: error.message
    };
  }
}

async function fetchAllPosts(username) {
  return fetchContent(username, 'allposts');
}

async function fetchStories(username) {
  return fetchContent(username, 'allstories');
}

module.exports = {
  fetchAllPosts,
  fetchStories
};