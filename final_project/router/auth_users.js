const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    let usersWithSameName = users.filter(user => {
        return user.username === username;
    });
    if (usersWithSameName.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validUsers = users.filter(user => {
        return (user.username === username && user.password === password)
    });
    if(validUsers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
  });

const getBookByISBN = (isbn) => {
    if (isbn) {
        const book = Object.values(books).find(book => book.isbn === isbn);

        if (book) {
            return book;
        }
        else {
            return null;
        }
    } else {
        return null;
    }
}

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const user = req.user;
    const review = req.body.review;
    const book = getBookByISBN(req.params.isbn);

    if (book) {
        if (review) {
            book.reviews[user] = review;
            return res.status(200).json({message: "Review successfully added!"});
        } else {
            return res.status(404).json({message: "Could not add empty review!"});    
        }
    } else {
        return res.status(404).json({message: "Book not found!"});
    }
});
    
// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const user = req.user;
    const book = getBookByISBN(req.params.isbn);

    if (book) {
        delete book.reviews[user];
        return res.status(200).json({message: "Review successfully deleted!"});
    } else {
        return res.status(404).json({message: "Book not found!"});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
