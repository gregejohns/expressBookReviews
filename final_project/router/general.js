const express = require('express');
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


// Get the book list available in the shop
public_users.get('/', function (req, res) {
  try {
    // Send the list of books as a JSON string
    return res.status(200).send(JSON.stringify(books, null, 2));
  } catch (error) {
    // Handle any potential errors
    return res.status(500).json({ message: "Error retrieving books" });
  }
});



// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  try {
    // Retrieve ISBN from the request parameters
    const isbn = req.params.isbn;

    // Check if the book exists in the database
    const book = books[isbn]; // Assuming books is an object keyed by ISBN

    if (book) {
      // Return the book details
      return res.status(200).json(book);
    } else {
      // If the book is not found, send a 404 response
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    // Handle any unexpected errors
    return res.status(500).json({ message: "Error retrieving book details" });
  }
});

  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  try {
    // Retrieve the author from the request parameters
    const author = req.params.author;

    // Filter books by the given author
const booksByAuthor = Object.values(books).filter(book =>
  book.author.toLowerCase().includes(author.toLowerCase())
);

    if (booksByAuthor.length > 0) {
      // Return the list of books by the author
      return res.status(200).json(booksByAuthor);
    } else {
      // If no books are found, send a 404 response
      return res.status(404).json({ message: "No books found for the given author" });
    }
  } catch (error) {
    // Handle any unexpected errors
    return res.status(500).json({ message: "Error retrieving books by author" });
  }
});


// Get book details based on title
public_users.get('/title/:title', function (req, res) {
  try {
    // Retrieve the title from the request parameters
    const title = req.params.title;

    // Filter books by the given title
    const booksByTitle = Object.values(books).filter(book =>
      book.title.toLowerCase().includes(title.toLowerCase())
    );

    if (booksByTitle.length > 0) {
      // Return the list of books with the matching title
      return res.status(200).json(booksByTitle);
    } else {
      // If no books are found, send a 404 response
      return res.status(404).json({ message: "No books found for the given title" });
    }
  } catch (error) {
    // Handle any unexpected errors
    return res.status(500).json({ message: "Error retrieving books by title" });
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
