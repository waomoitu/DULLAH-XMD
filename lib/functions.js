const axios = require('axios');

const fetchJson = async (url, options = {}) => {
    try {
        const res = await axios.get(url, options);
        return res.data;
    } catch (err) {
        console.error('fetchJson error:', err.message);
        return {};
    }
};

module.exports = { fetchJson };
