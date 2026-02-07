const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Function to check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let usersWithSameName = users.filter((user) => {
        return user.username === username;
    });

    // Return true if any user with the same username is found, otherwise false
    return usersWithSameName.length > 0;
}

// Route to register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({ username, password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(400).json({ message: "User already exists!" });
        }
    } else {
        return res.status(400).json({ message: "Unable to register user. Username and password are required." });
    }
});

// General Functions with Axios to fetch book details using async/await

const axios = require('axios');

// Function to get the list of books using async/await
async function getAllBooks() {
    try {
        // Fetching the books list from the server
        const response = await axios.get('http://localhost:5000/getallbooks');
        console.log("Books available in the shop:", response.data);
    } catch (error) {
        console.error("Error fetching books:", error.message);
    }
}

// Calling the function to get all books
getAllBooks();

// Function to get book details by ISBN using async/await
async function getBookByISBN(isbn) {
    try {
        // Fetching book details by ISBN
        const response = await axios.get(`http://localhost:5000/getbooksbyISBN/${isbn}`);
        console.log(`Book details for ISBN ${isbn}:`, response.data);
    } catch (error) {
        console.error(`Error fetching book details for ISBN ${isbn}:`, error.message);
    }
}

// Example of calling the function with a sample ISBN
getBookByISBN('1');

// Function to get books by a specific author using async/await
async function getBooksByAuthor(author) {
    try {
        // Fetching books by author
        const response = await axios.get(`http://localhost:5000/getbooksbyauthor/${author}`);
        console.log(`Books by author ${author}:`, response.data);
    } catch (error) {
        console.error(`Error fetching books by author ${author}:`, error.message);
    }
}

// Example of calling the function with a sample author
getBooksByAuthor('Chinua Achebe');

// Function to get books by title using async/await
async function getBooksByTitle(title) {
    try {
        // Fetching books by title
        const response = await axios.get(`http://localhost:5000/getbooksbytitle/${title}`);
        console.log(`Books with title "${title}":`, response.data);
    } catch (error) {
        console.error(`Error fetching books with title "${title}":`, error.message);
    }
}

// Example of calling the function with a sample title
getBooksByTitle('Things fall apart');

// Route to get the list of all books available in the shop
public_users.get('/getallbooks', function (req, res) {
    try {
        // Check if books object has any keys (books available)
        if (Object.keys(books).length > 0) {
            // Return the whole books object
            return res.status(200).json(books);
        } else {
            return res.status(404).json({ message: "No books found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving books", error: error.message });
    }
});

// Route to get book details based on ISBN
public_users.get('/getbooksbyISBN/:isbn', function (req, res) {
    const { isbn } = req.params;  // Extract ISBN from URL parameters

    try {
        // Search for a book with the given ISBN
        const book = Object.values(books).find(b => b.isbn === isbn);

        if (book) {
            return res.status(200).json(book);  // Return the book details
        } else {
            return res.status(404).json({ message: "Book not found with the given ISBN" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving book", error: error.message });
    }
});

// Route to get books by a specific author
public_users.get('/getbooksbyauthor/:author', function (req, res) {
    const { author } = req.params;  // Extract the author from URL parameters

    try {
        // Filter books by the provided author
        const filteredBooks = Object.values(books).filter(book => book.author.toLowerCase().includes(author.toLowerCase()));

        if (filteredBooks.length > 0) {
            return res.status(200).json(filteredBooks);  // Return the filtered books
        } else {
            return res.status(404).json({ message: "No books found for this author" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving books", error: error.message });
    }
});

// Route to get books by title
public_users.get('/getbooksbytitle/:title', function (req, res) {
    const { title } = req.params;  // Extract the title from URL parameters

    try {
        // Filter books by the provided title (case-insensitive)
        const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase().includes(title.toLowerCase()));

        if (filteredBooks.length > 0) {
            return res.status(200).json(filteredBooks);  // Return the filtered books
        } else {
            return res.status(404).json({ message: "No books found with this title" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving books", error: error.message });
    }
});

// Route to get the book review based on ISBN
public_users.get('/getbookreview/:isbn', function (req, res) {
    const { isbn } = req.params;  // Extract ISBN from URL parameters

    try {
        // Find the book with the given ISBN
        const book = Object.values(books).find(b => b.isbn === isbn);

        if (book) {
            // If the book has reviews, return them
            if (Object.keys(book.reviews).length > 0) {
                return res.status(200).json(book.reviews);  // Return the reviews
            } else {
                return res.status(404).json({ message: "No reviews found for this book" });
            }
        } else {
            return res.status(404).json({ message: "Book not found with the given ISBN" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving reviews", error: error.message });
    }
});

module.exports.general = public_users;
