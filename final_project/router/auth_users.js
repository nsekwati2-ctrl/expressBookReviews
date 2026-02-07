const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
const user = users.find(user => user.username === username);
  return user ? false : true;  // Return false if the username exists, true if it's a valid new username
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
const user = users.find(user => user.username === username && user.password === password);
  return user ? true : false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
 const { username, password } = req.body;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Authenticate the user
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    const accessToken = jwt.sign({ username }, 'your_jwt_secret_key', { expiresIn: '1h' });

    return res.status(200).json({
      message: "User successfully logged in",
      accessToken  // Return the token
    });
  } else {
    return res.status(401).json({ message: "Invalid login credentials" });
  }
});

// Add a book review
regd_users.put("/reviewadded/:isbn", (req, res) => {
  //Write your code here
  const { username } = req.body;
  const { isbn } = req.params;
  const { review } = req.body;  // Assuming the review is provided in the request body
  
  // Check if the review and user are valid
  if (!review || !username || !isbn) {
    return res.status(400).json({ message: "Review, username, and isbn are required" });
  }

  // Find the book with the given ISBN
  const book = books[isbn];  // Assuming `books` is an object and `isbn` is a key

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Add the review to the book's reviews (assuming it's an object of reviews)
  if (!book.reviews) {
    book.reviews = {};  // Initialize reviews if it doesn't exist
  }

  // Add the review to the book
  book.reviews[username] = review;

  return res.status(200).json({ message: "Review added successfully", book });
});

// Delete a book review
regd_users.delete("/deletereview/:isbn", (req, res) => {
  // Extract the JWT token from the Authorization header
  const token = req.headers["authorization"]?.split(" ")[1]; // Bearer <token>

  // If no token is provided
  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  // Verify the JWT token
  jwt.verify(token, 'your_jwt_secret_key', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    const username = decoded.username; // Extract the username from the decoded token

    const { isbn } = req.params; // Get ISBN from the request parameters

    // Find the book with the given ISBN
    const book = books[isbn];  // Assuming `books` is an object and `isbn` is a key

    if (!book || !book.reviews || !book.reviews[username]) {
      return res.status(404).json({ message: "Review not found for this book" });
    }

    // Delete the user's review from the book's reviews
    delete book.reviews[username];

    return res.status(200).json({ message: "Review deleted successfully" });
  });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
