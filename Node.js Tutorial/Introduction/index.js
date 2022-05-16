// Import packages

// Web application framework
const express = require('express');

// ID generator for book IDs
const generateId = require('uuid').v4;

// Initalize an express app
const app = express();

// Parses JSON request data onto request.body
app.use(express.json()); 

// Simple array to store books while the server is running
let booksDatabase = []; 

// Hello world test endpoint
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Create a new book
app.post('/books', (req, res) => {
    const bookId = generateId();
    let newBook = req.body.book;
    newBook.id = bookId;
    booksDatabase.push(newBook);
    res.send({ book: newBook });
});

// Get all books
app.get('/books', (req, res) => {
    res.send({ books: booksDatabase });
});

// Get a single book by book ID
app.get('/books/:bookId', (req, res) => {
    const book = booksDatabase.find(book => book.id === req.params.bookId);
    if(!book) {
        res.sendStatus(404);
    }
    else {
        res.send({ book });
    }
});

// Update a book by book ID
app.put('/books/:bookId', (req, res) => {
    const bookIndex = booksDatabase.findIndex(book => book.id === req.params.bookId);
    if(bookIndex === -1) {
        res.sendStatus(404);
    }
    else {
        booksDatabase[bookIndex] = { ...booksDatabase[bookIndex], ...req.body.book };
        res.send({ book: booksDatabase[bookIndex] });
    }
});

// Delete a book by book ID
app.delete('/books/:bookId', (req, res) => {
    const bookIndex = booksDatabase.findIndex(book => book.id === req.params.bookId); 
    if(bookIndex === -1) {
        res.sendStatus(404);
    }
    else {
        const deletedBook = booksDatabase.splice(bookIndex, 1);
        res.send({ book: deletedBook });
    }
});

// Which port the server should run on
const port = 3000;

// Start our express web server on the specified port, and print a message on successful startup
app.listen(port, () => {
    console.log(`Your REST API is live at port ${port}`);
});
