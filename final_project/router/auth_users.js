const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  { username: "testuser", password: "securepassword" }
];


const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username, password) => {
  console.log("Authenticated user check for:", username, password); // Debug log
  console.log("Users array:", users); // Debug log

  // Check if username and password match any registered user
  const user = users.find(user => user.username === username && user.password === password);
  return !!user; // Return true if user is found, false otherwise
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Validate credentials
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Generate JWT token
  const accessToken = jwt.sign({ username }, "access_token_secret", { expiresIn: "1h" });

  // Save the token in the session
  req.session.token = accessToken;

  return res.status(200).json({ message: "Login successful", accessToken });
});


// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { review } = req.query; // Review text from the request query
  const { username } = req.user; // Extract username from the session or token
  const isbn = req.params.isbn; // Extract ISBN from the route parameter

  // Validate the review and ISBN
  if (!isbn) {
    return res.status(400).json({ message: "ISBN is required" });
  }
  if (!review) {
    return res.status(400).json({ message: "Review text is required" });
  }

  // Find the book by ISBN
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Initialize the reviews object if it doesn't exist
  if (!book.reviews) {
    book.reviews = {};
  }

  // Add or update the review
  book.reviews[username] = review;

  return res.status(200).json({ message: "Review added/updated successfully", reviews: book.reviews });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { username } = req.user; // Get the username from the authenticated user (session or token)
  const isbn = req.params.isbn; // Get the ISBN from the route parameter

  // Validate the ISBN
  if (!isbn) {
    return res.status(400).json({ message: "ISBN is required" });
  }

  // Find the book by ISBN
  const book = books[isbn];
  if (!book || !book.reviews) {
    return res.status(404).json({ message: "No reviews found for this book" });
  }

  // Check if the user's review exists
  if (!book.reviews[username]) {
    return res.status(404).json({ message: "You have not reviewed this book" });
  }

  // Delete the user's review
  delete book.reviews[username];

  return res.status(200).json({ message: "Review deleted successfully", reviews: book.reviews });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
