const express = require('express');
const { engine } = require('express-handlebars');
const session = require('express-session');
let MongoStore = require('connect-mongo');
if (MongoStore.default) {
    MongoStore = MongoStore.default;
}
require('dotenv').config();

const { BookReadModel, BookWriteModel } = require('./models/Book');

const app = express();

// Request body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Handlebars View Engine Configuration
app.engine('hbs', engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', './views');

// Centralized Stateless Session Architecture targeting MongoDB Atlas
app.use(session({
    secret: process.env.SESSION_SECRET || 'vothanhlong_23it147_cloud_secret_key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI_WRITE,
        dbName: 'vothanhlong_23it147',
        collectionName: 'sessions',
        ttl: 14 * 24 * 60 * 60 // Expire session after 14 days
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day cookie lifecycle
        httpOnly: true
    }
}));

// Route: GET / - Display Inventory (Read stream via user_read_23it147)
app.get('/', async (req, res) => {
    try {
        const books = await BookReadModel.find().lean();
        const feedbackMsg = req.session.message;
        delete req.session.message;
        res.render('index', { books, message: feedbackMsg });
    } catch (err) {
        res.status(500).send("Database Read Error: " + err.message);
    }
});

// Route: GET /add - Render Book Registration Form
app.get('/add', (req, res) => {
    res.render('add');
});

// Route: POST /add - Register New Book (Write stream via user_write_23it147)
app.post('/add', async (req, res) => {
    try {
        const { bookCode, title, author, originalPrice } = req.body;

        // Security Filter: Enforce prefix with last 3 digits of Student ID (147-)
        if (!bookCode.startsWith('147-')) {
            return res.render('add', {
                error: `Security Validation Error: Product code '${bookCode}' must start with mandatory prefix '147-' (Student ID: 23IT147)`
            });
        }

        // Dynamic VAT Algorithm: (Last digit of ID 7 + 6)% = 13%
        const price = parseFloat(originalPrice);
        const vatRate = 13;
        const finalPrice = Math.round(price * (1 + vatRate / 100));

        const newBook = new BookWriteModel({
            bookCode,
            title,
            author,
            originalPrice: price,
            vatRate,
            finalPrice,
            studentOwner: 'Vo Thanh Long - 23IT147'
        });

        await newBook.save();

        req.session.message = `Book '${title}' committed to Cloud Database successfully!`;
        res.redirect('/');
    } catch (err) {
        res.render('add', { error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running at: http://localhost:${PORT}`);
    console.log('Developer: Vo Thanh Long - Student ID: 23IT147');
});