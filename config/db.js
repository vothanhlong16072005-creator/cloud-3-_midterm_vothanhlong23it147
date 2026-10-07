// config/db.js
const mongoose = require('mongoose');
require('dotenv').config();

const connRead = mongoose.createConnection(process.env.MONGO_URI_READ);
connRead.on('connected', () => {
    console.log('[READ POOL] Connected to vothanhlong_23it147 by user_read_23it147');
});
connRead.on('error', (err) => console.error('[READ POOL ERROR]', err));

const connWrite = mongoose.createConnection(process.env.MONGO_URI_WRITE);
connWrite.on('connected', () => {
    console.log('[WRITE POOL] Connected to vothanhlong_23it147 by user_write_23it147 - Vo Thanh Long 23IT147'); 
});
connWrite.on('error', (err) => console.error('[WRITE POOL ERROR]', err));

module.exports = { connRead, connWrite };