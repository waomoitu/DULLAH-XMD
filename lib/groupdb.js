// GroupDB fake / in-memory
const GroupDB = {
    // Hapa tunahifadhi active users kwa chatId
    _data: {},

    // Set active user manually (optional)
    setActiveUser: (chatId, userId) => {
        if (!GroupDB._data[chatId]) GroupDB._data[chatId] = [];
        if (!GroupDB._data[chatId].includes(userId)) {
            GroupDB._data[chatId].push(userId);
        }
    },

    // Get active users
    getActiveUsers: async (chatId) => {
        // Return array of objects sama na Mongo style: { jid: "user@..." }
        const users = GroupDB._data[chatId] || [];
        return users.map(u => ({ jid: u }));
    },

    // Optional: Reset chat
    resetChat: (chatId) => {
        GroupDB._data[chatId] = [];
    }
};

module.exports = GroupDB;
