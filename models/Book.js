const mongoose = require('mongoose');
const { connRead, connWrite } = require('../config/db');

const BookSchema = new mongoose.Schema({
    bookCode: {
        type: String,
        required: [true, 'Product code is required'],
        validate: {
            validator: function(v) {
                // Must strictly begin with the last 3 digits of Student ID: 147-
                return /^147-/.test(v);
            },
            message: props => `Validation Error: '${props.value}' is invalid! 
            Product code must have the prefix '147-' (last 3 digits of Student ID 23IT147).`
        }
    },
    title: { 
        type: String, 
        required: [true, 'Book title is required'],
        trim: true 
    },
    author: { 
        type: String, 
        required: [true, 'Author name is required'],
        trim: true 
    },
    originalPrice: { 
        type: Number, 
        required: [true, 'Original price is required'], 
        min: [0, 'Original price cannot be negative'] 
    },
    vatRate: { 
        type: Number, 
        default: 13 // Dynamic VAT: (Last digit of Student ID 7 + 6)% = 13%
    },
    finalPrice: { 
        type: Number, 
        required: true 
    },
    studentOwner: { 
        type: String, 
        default: 'Vo Thanh Long - 23IT147' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Bind schema to segregated connection pools
const BookReadModel = connRead.model('Book', BookSchema);
const BookWriteModel = connWrite.model('Book', BookSchema);

module.exports = { BookReadModel, BookWriteModel };