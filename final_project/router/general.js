const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
const { username, password } = req.body;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({ username, password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(400).json({ message: "User already exists!" });  // Change to 400 Bad Request for better semantics
        }
    } else {
        // Return error if username or password is missing
        return res.status(400).json({ message: "Unable to register user. Username and password are required." });
    }
});




// Function to get the list of books using Promises
// general.js
const axios = require('axios');

// Function to get the list of books using async/await
async function getAllBooks() {
  try {
    const response = await axios.get('http://localhost:5000/getallbooks');
    console.log("Books available in the shop:", response.data);
  } catch (error) {
    console.error("Error fetching books:", error.message);
  }
}

getAllBooks();

async function getBookByISBN(isbn) {
  try {
    const response = await axios.get(`http://localhost:5000/getbooksbyISBN/${isbn}`);
    console.log(`Book details for ISBN ${isbn}:`, response.data);
  } catch (error) {
    console.error(`Error fetching book details for ISBN ${isbn}:`, error.message);
  }
}

// Call the function with an example ISBN (replace with a real ISBN)
getBookByISBN('1');

async function getBooksByAuthor(author) {
  try {
    const response = await axios.get(`http://localhost:5000/getbooksbyauthor/${author}`);
    console.log(`Books by author ${author}:`, response.data);
  } catch (error) {
    console.error(`Error fetching books by author ${author}:`, error.message);
  }
}

// Call the function with an example author (replace with a real author name)
getBooksByAuthor('Chinua Achebe');

async function getBooksByTitle(title) {
  try {
    const response = await axios.get(`http://localhost:5000/getbooksbytitle/${title}`);
    console.log(`Books with title "${title}":`, response.data);
  } catch (error) {
    console.error(`Error fetching books with title "${title}":`, error.message);
  }
}

// Call the function with an example title (replace with a real title)
getBooksByTitle('Things fall apart');
// Get the book list available in the shop
public_users.get('/getallbooks',function (req, res) {
  //Write your code here
   try {
        // Check if books object has any keys
        if (Object.keys(books).length > 0) {
            // Send the whole books object
            return res.status(200).json(books);
        } else {
            return res.status(404).json({ message: "No books found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving books", error: error.message });
    }
  
  });

// Get book details based on ISBN
public_users.get('/getbooksbyISBN/:isbn',function (req, res) {
  //Write your code here
 
          const { isbn } = req.params;  // Destructure to get isbn directly

    try {
        // Search for a book with the given ISBN
        const book = Object.values(books).find(b => b.isbn === isbn);

        // Check if the book is found
        if (book) {
            return res.status(200).json(book); // Return the book details
        } else {
            return res.status(404).json({ message: "Book not found with the given ISBN" }); // Book not found
        }
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving book", error: error.message });
    }
        
 });
  
// Get book details based on author
public_users.get('/getbooksbyauthor/:author',function (req, res) {
  //Write your code here
   const { author } = req.params;  // Extract the author from the URL parameter

    try {
        // Filter books by the provided author
        const filteredBooks = Object.values(books).filter(book => book.author.toLowerCase().includes(author.toLowerCase()));

        // If books are found, return them, else return an error message
        if (filteredBooks.length > 0) {
            return res.status(200).json(filteredBooks);  // Send the filtered books
        } else {
            return res.status(404).json({ message: "No books found for this author" });  // No books found for the author
        }
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving books", error: error.message });
    }
});

// Get all books based on title
public_users.get('/getbooksbytitle/:title',function (req, res) {
  //Write your code here
 const { title } = req.params;  // Extract the title from the URL parameter

    try {
        // Filter books by the provided title (case-insensitive)
        const filteredBooks = Object.values(books).filter(book => 
            book.title.toLowerCase().includes(title.toLowerCase())
        );

        // If books are found, return them, else return an error message
        if (filteredBooks.length > 0) {
            return res.status(200).json(filteredBooks);  // Send the filtered books
        } else {
            return res.status(404).json({ message: "No books found with this title" });  // No books found with the given title
        }
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving books", error: error.message });
    }
  });

//  Get book review
public_users.get('/getbookreview/:isbn',function (req, res) {
  //Write your code here
const { isbn } = req.params;  // Extract the ISBN from the URL parameter

    try {
        // Find the book with the given ISBN
        const book = Object.values(books).find(b => b.isbn === isbn);

        // If the book is found
        if (book) {
            // If the book has reviews, return them
            if (Object.keys(book.reviews).length > 0) {
                return res.status(200).json(book.reviews);  // Send the reviews
            } else {
                return res.status(404).json({ message: "No reviews found for this book" });  // No reviews available
            }
        } else {
            return res.status(404).json({ message: "Book not found with the given ISBN" });  // Book not found
        }
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving reviews", error: error.message });
    }
  });

module.exports.general = public_users;
