const mongoose = require('mongoose');
require('dotenv').config();

const options = {
    tls: true,
    serverSelectionTimeoutMS: 10000, // Timeout 10s nếu mạng lag
};

// Create isolated read-only connection pool bound to user_read_23it147
const connRead = mongoose.createConnection(process.env.MONGO_URI_READ, options);

connRead.on('connected', () => {
    console.log('[READ POOL] Successfully connected to vothanhlong_23it147 via user_read_23it147');
});

connRead.on('error', (err) => {
    console.error('[READ POOL ERROR] Connection failure:', err.message || err);
});

// Create write-authorized connection pool bound to user_write_23it147
const connWrite = mongoose.createConnection(process.env.MONGO_URI_WRITE, options);

connWrite.on('connected', () => {
    console.log('[WRITE POOL] Successfully connected to vothanhlong_23it147 via user_write_23it147 - Vo Thanh Long 23IT147');
});

connWrite.on('error', (err) => {
    console.error('[WRITE POOL ERROR] Connection failure:', err.message || err);
});

module.exports = { connRead, connWrite };