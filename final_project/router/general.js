const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
        if (!isValid(username)) { 
            users.push({"username": username,"password": password});
            return res.status(200).json({message: "User successfully registered! Now you can log in."});
        } else {
            return res.status(404).json({message: "User already exists!"});    
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    const booksPromise = new Promise((resolve, reject) => {
        setTimeout(resolve(JSON.stringify(books, null, 4)), 0);
    })
    booksPromise.then(books => res.status(200).send(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const bookPromise = new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        if (isbn) {
            const book = Object.values(books).find(book => book.isbn === isbn);
    
            if (book) {
                setTimeout(resolve(JSON.stringify(book, null, 4)), 0);
            }
            else {
                setTimeout(reject("Book not found"), 0);
            }
        }
    })
    bookPromise.then(
        book => res.status(200).send(book),
        message => res.status(404).send(message)
    );
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const booksPromise = new Promise((resolve, reject) => {
        const author = req.params.author;
        if (author) {
            const booksByAuthor = [...Object.values(books).filter(book => book.author === author)];
    
            if (booksByAuthor) {
                setTimeout(resolve(JSON.stringify(booksByAuthor, null, 4)), 0);
            }
            else {
                setTimeout(reject("No books found"), 0);
            }
        }
    })
    booksPromise.then(
        books => res.status(200).send(books),
        message => res.status(404).send(message)
    );
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const booksPromise = new Promise((resolve, reject) => {
        const title = req.params.title;
        if (title) {
            const booksByTitle = [...Object.values(books).filter(book => book.title === title)];
    
            if (booksByTitle) {
                setTimeout(resolve(JSON.stringify(booksByTitle, null, 4)), 0);
            }
            else {
                setTimeout(reject("No books found"), 0);
            }
        }
    })
    booksPromise.then(
        books => res.status(200).send(books),
        message => res.status(404).send(message)
    );
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (isbn) {
        const book = Object.values(books).find(book => book.isbn === isbn);

        if (book) {
            return res.status(200).send(JSON.stringify(book.reviews, null, 4));
        }
        else {
            return res.status(404).send("Book not found");
        }
    }
});

module.exports.general = public_users;
