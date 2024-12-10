const express = require('express');
const axios = require('axios'); // Import Axios
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  try {
    const { username, password } = req.body; // Extract username and password from the request body

    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if the username already exists
    const userExists = users.some(user => user.username === username);

    if (userExists) {
      return res.status(409).json({ message: "Username already exists" });
    }

    // Add the new user to the list of users
    users.push({ username, password });
    return res.status(201).json({ message: "User successfully registered" });
  } catch (error) {
    // Handle any unexpected errors
    return res.status(500).json({ message: "Error registering user" });
  }
});


// Get the book list available in the shop using async/await
public_users.get('/', async (req, res) => {
  try {
    // Simulate an asynchronous fetch with Axios (could be from an external service)
    const bookList = await new Promise((resolve, reject) => {
      setTimeout(() => resolve(books), 500); // Simulate delay and resolve the books object
    });

    return res.status(200).json(bookList);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book list" });
  }
});



// Get book details based on ISBN using async/await
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
      const isbn = req.params.isbn; // Extract ISBN from the request parameters
  
      // Simulate an asynchronous fetch with Axios or a Promise
      const bookDetails = await new Promise((resolve, reject) => {
        setTimeout(() => {
          const book = books[isbn];
          if (book) {
            resolve(book); // Resolve with the book details if found
          } else {
            reject(new Error("Book not found")); // Reject if book does not exist
          }
        }, 500); // Simulate delay
      });
  
      return res.status(200).json(bookDetails);
    } catch (error) {
      return res.status(404).json({ message: error.message || "Error fetching book details" });
    }
  });
  

  
// Get book details based on Author using async/await
public_users.get('/author/:author', async (req, res) => {
    try {
      const author = req.params.author.toLowerCase(); // Extract and normalize the author name
  
      // Simulate an asynchronous fetch with Axios or a Promise
      const booksByAuthor = await new Promise((resolve, reject) => {
        setTimeout(() => {
          const matchingBooks = Object.values(books).filter(book =>
            book.author.toLowerCase().includes(author) // Case-insensitive match
          );
  
          if (matchingBooks.length > 0) {
            resolve(matchingBooks); // Resolve with the list of matching books
          } else {
            reject(new Error("No books found for the given author")); // Reject if no matches
          }
        }, 500); // Simulate delay
      });
  
      return res.status(200).json(booksByAuthor);
    } catch (error) {
      return res.status(404).json({ message: error.message || "Error fetching books by author" });
    }
  });
  


// Get book details based on Title using async/await
public_users.get('/title/:title', async (req, res) => {
    try {
      const title = req.params.title.toLowerCase(); // Extract and normalize the title
  
      // Simulate an asynchronous fetch with Axios or a Promise
      const booksByTitle = await new Promise((resolve, reject) => {
        setTimeout(() => {
          const matchingBooks = Object.values(books).filter(book =>
            book.title.toLowerCase().includes(title) // Case-insensitive match
          );
  
          if (matchingBooks.length > 0) {
            resolve(matchingBooks); // Resolve with the list of matching books
          } else {
            reject(new Error("No books found with the given title")); // Reject if no matches
          }
        }, 500); // Simulate delay
      });
  
      return res.status(200).json(booksByTitle);
    } catch (error) {
      return res.status(404).json({ message: error.message || "Error fetching books by title" });
    }
  });
  


// Get book reviews based on ISBN
public_users.get('/review/:isbn', function (req, res) {
  try {
    // Retrieve the ISBN from the request parameters
    const isbn = req.params.isbn;

    // Find the book using the ISBN
    const book = books[isbn]; // Assuming books is an object keyed by ISBN

    if (book && book.reviews) {
      // Return the book reviews
      return res.status(200).json(book.reviews);
    } else if (book) {
      // If no reviews exist for the book, send an empty object
      return res.status(200).json({});
    } else {
      // If the book is not found, send a 404 response
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    // Handle any unexpected errors
    return res.status(500).json({ message: "Error retrieving book reviews" });
  }
});


module.exports.general = public_users;
